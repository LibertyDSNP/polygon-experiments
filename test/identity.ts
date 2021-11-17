/* eslint-disable camelcase */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractReceipt, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import {
  AcmeIdentity__factory,
  Identity,
  IdentityBeacon,
  IdentityBeacon__factory,
  IdentityFactory,
  IdentityFactory__factory,
  IdentityProxy__factory,
  Identity__factory,
} from "../typechain";

const wait = async (
  transaction: Promise<ContractTransaction>
): Promise<ContractReceipt> => await (await transaction).wait();

const getReturnValue = async <T>(
  receipt: Promise<ContractTransaction>
): Promise<T> => {
  const { events } = await (await receipt).wait();

  if (events !== undefined && events.length > 0) {
    const [{ args }] = events.slice(-1);

    if (args !== undefined && args.length > 0) {
      return args[0] as T;
    }
  }

  throw new Error("no return value");
};

describe("IdentityFactory", () => {
  let deployer: SignerWithAddress;
  let aliceSigner: SignerWithAddress;
  let bobSigner: SignerWithAddress;

  let Identity: Identity__factory;
  let AcmeIdentity: AcmeIdentity__factory;
  let IdentityBeacon: IdentityBeacon__factory;
  let IdentityFactory: IdentityFactory__factory;
  let IdentityProxy: IdentityProxy__factory;

  let identity: Identity;
  let beacon: IdentityBeacon;
  let factory: IdentityFactory;

  let acmeIdentity: Identity;
  let acmeBeacon: IdentityBeacon;

  before(async () => {
    [deployer, aliceSigner, bobSigner] = await ethers.getSigners();

    Identity = await ethers.getContractFactory("Identity");
    AcmeIdentity = await ethers.getContractFactory("AcmeIdentity");
    IdentityBeacon = await ethers.getContractFactory("IdentityBeacon");
    IdentityFactory = await ethers.getContractFactory("IdentityFactory");
    IdentityProxy = await ethers.getContractFactory("IdentityProxy");

    identity = await Identity.deploy();
    beacon = await IdentityBeacon.deploy(identity.address);
    factory = await IdentityFactory.deploy(beacon.address);

    acmeIdentity = await AcmeIdentity.deploy();
    acmeBeacon = await IdentityBeacon.deploy(acmeIdentity.address);
  });

  it("can create new identities", async () => {
    const aliceAddress = await getReturnValue<string>(
      factory.connect(aliceSigner).createIdentity()
    );
    const aliceIdentity = Identity.connect(aliceSigner).attach(aliceAddress);
    aliceIdentity.setName("Alice");

    const bobAddress = await getReturnValue<string>(
      factory.connect(bobSigner).createIdentity()
    );
    const bobIdentity = Identity.connect(bobSigner).attach(bobAddress);
    bobIdentity.setName("Bob");

    expect(await aliceIdentity.name()).to.equal("Alice");
    expect(await bobIdentity.name()).to.equal("Bob");
  });

  it("can change identity implementations", async () => {
    const customBeacon = await IdentityBeacon.deploy(identity.address);
    const customFactory = await IdentityFactory.deploy(customBeacon.address);

    const address = await getReturnValue<string>(
      customFactory.createIdentity()
    );
    const aliceIdentity = Identity.attach(address);

    expect(await aliceIdentity.version()).to.equal("1.0");

    await wait(customBeacon.upgradeTo(acmeIdentity.address));

    expect(await aliceIdentity.version()).to.equal("Acme 1.0");
  });

  it("identity owner can change identity implementations", async () => {
    const address = await getReturnValue<string>(
      factory.connect(aliceSigner).createIdentity()
    );
    const aliceIdentity = Identity.attach(address);
    const aliceIdentityProxy = IdentityProxy.attach(address);

    expect(await aliceIdentity.version()).to.equal("1.0");

    await wait(
      aliceIdentityProxy.connect(aliceSigner).setBeacon(acmeBeacon.address)
    );

    expect(await aliceIdentity.version()).to.equal("Acme 1.0");
  });
});
