export class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  static dollar(amount) {
    return new Money(amount, "USD");
  }

  static franc(amount) {
    return new Money(amount, "CHF");
  }

  times(multiplier) {
    return new Money(this.amount * multiplier, this.currency);
  }

  plus(amount) {
    return new Money(this.amount + amount, this.currency);
  }

  equals(other) {
    return (
      other instanceof Money &&
      this.amount === other.amount &&
      this.constructor === other.constructor &&
      this.currency === other.currency
    );
  }
}

export class Bnank {
  addRate() {}

  change() {
    return Money.franc(5);
  }
}
