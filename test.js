import { expect } from "chai";
import { describe } from "mocha";
import {  Bnank, Money } from "./src/money.js";

describe("invoice report generation", () => {
  it("should multiply dollars", () => {
    const five = Money.dollar(5);

    let product = five.times(2);
    expect(product).deep.equals(Money.dollar(10));

    product = five.times(3);
    expect(product).deep.equals(Money.dollar(15));
  });
  it("should multiply francs", () => {
    const five = Money.franc(5);

    let product = five.times(2);
    expect(product).deep.equals(Money.franc(10));

    product = five.times(3);
    expect(product).deep.equals(Money.franc(15));
  });

  it("should test equality", () => {
    expect(Money.dollar(5).equals(Money.dollar(5))).to.be.true;
    expect(Money.dollar(5).equals(Money.dollar(6))).to.be.false;

    expect(Money.franc(5).equals(Money.franc(5))).to.be.true;
    expect(Money.franc(5).equals(Money.franc(6))).to.be.false;

    expect(Money.franc(5).equals(Money.dollar(6))).to.be.false;
    expect(Money.franc(5).equals(Money.dollar(5))).to.be.false;
  });

  it("should use currencies", () => {
    expect("USD").equals(Money.dollar(5).currency);
    expect("CHF").equals(Money.franc(5).currency);
  });

  it("should sum money", () => {

    expect(
      Money.dollar(5)
      .plus(5)
      .equals(Money.dollar(10))
    ).to.be.true

  })


  it("should exchange money", () => {

    const bank = new Bnank();
    bank.addRate("CHF", "USD", 2)

    const chf = bank.change(Money.dollar(10), "CHF")

    expect(chf.equals(Money.franc(5)))

  })

});


describe("The bank should exchange money", () => {
  it("should generate a report", () => {
    const codeCorp = Money.dollar(25).times(1000);

    const bugBurger = Money.franc(150).times(400);

    const bank = new Bank();
    bank.addRate("CHF", "USD", 1.5);

    const bugBurgerInDollars = bank.change(bugBurger, "USD");

    const total = bugBurgerInDollars.plus(codeCorp.amount);

		expect(total.amount).to.equals(65000);

  });
});