# Codemotion 2024 - TDD workshop

### Slides

https://drive.google.com/file/d/1tMe-jXVAQYaHNJDQDiks3EXThVD4hjXr/view?usp=drive_link

### Rules:

1. Add a small test.
2. Run all the tests and fail.
3. Make a small change.
4. Run tests and succeed.
5. Refactor to remove duplication.

### Introduction

We want to create a multi-currency report, like this:

| **Supplier** | **Quantity** | **Price** | **Total** |
| --- | --- | --- | --- |
| CodeCorp | 1000 | 25 USD | 25000 USD |
| BugBusters | 400 | 150 CHF | 60000 CHF |
|  |  |  |  |
| **Total** |  |  | 65000 USD |

We also need to specify exchange rates:

| **From** | **To** | **Rate** |
| --- | --- | --- |
| CHF | USD | 1.5 |

Thinking about what we want to achieve, I wrote some tasks to guide us during development:

- [ ]  generate report
- [ ]  1000 x 25USD + 400 x 150CHF = 65000USD when the rate is 2:1
- [ ]  `$5 + 10 CHF = $10` if rate is 2:1
- [ ]  `$5 * 2 = $10`
- [ ]  [ ]

### 1 - First step

```jsx
describe("Invoice Calculator", () => {
  it("should multiply dollars", () => {
    const five = new Dollar(5);

    five.times(2);
    expect(five.amount).equals(10);
  });
});
```

### 2 - Implementation

```jsx

export class Dollar {
  constructor(amount) {
    this.amount = amount;
  }

  times(multiplier) {
    this.amount = 10;
  }
}

```

### 3 - The code sucks

We can now consider the first test completed. Next, we'll deal with those strange side effects.

Yes, yes, public fields, side effects, integers for monetary amounts, variable names that don't reflect the value, and so on. Small steps. We’ll note the so-called code smells and move on.

<update to-do list>

- [ ]  side effects
- [ ]  round integer values
- [ ]  variable names

The code sucks, let’s improve it.

```jsx

export class Dollar {
  constructor(amount) {
    this.amount = amount;
  }

  times(multiplier) {
    this.amount = 5 * 2;
  }
}

```

The TDD cycle consists of three main phases:

- **Write a test**: Imagine how you want the code to work and create the test that reflects this vision, treating it as a story you tell through code.
- **Make the test pass**: Focus on getting the test to pass quickly. Prioritize speed over perfection, even if it means initially writing imperfect code.
- **Improve the code**: Once the test passes, clean the code, remove duplications, and improve the structure to follow good clean code practices.

The goal is "working clean code that works"—first ensuring it works, then refining the code to make it clean.

One way to make it cleaner might be adding another test that fails, then fixing the code.

```jsx

it("should multiply dollars", () => {
  const five = new Dollar(5);

  five.times(2);
  expect(five.amount).to.equals(10);

  five.times(3);
  expect(five.amount).to.equals(15);
});

```

code:

```jsx

times(multiplier) {
  this.amount = 5 * multiplier;
}

```

At this point, I think we can refactor the test, trying to improve variable names.

```jsx

let product = five.times(2);
expect(product.amount).equals(10);

product = five.times(3);
expect(product.amount).equals(15);

```

code:

```jsx

times(multiplier) {
  return new Dollar(this.amount * multiplier);
}

```

Additionally, since `times()` now returns an object, we can assert that `product` (not `product.amount`) equals 10 or 15 dollars.

```jsx

it("should multiply dollars", () => {
  const five = new Dollar(5);

  let product = five.times(2);
  expect(product).to.equals(new Dollar(10));

  product = five.times(3);
  expect(product).to.equals(new Dollar(15));
});

```

But if we run this test, it fails, so we need to modify it using `deep.equals`, as follows:

```jsx

expect(product).deep.equals(new Dollar(10));

```

**The test passes, the bar stays green. We are happy. Do these steps seem too small?** Remember, TDD is not about taking tiny steps but **being able** to take tiny steps.

Do I write code every day with steps this small? Maybe not.

But when things get even slightly complicated, I'm glad I can do it. If we can take too-small steps, we can certainly take right-sized steps.

But if we only take bigger steps, we’ll never know if smaller ones are appropriate.

***<update checklist>***

Let’s recap: What have we done so far?

- We listed the smallest tests needed to achieve the final goal.
- We told a story with a code snippet about how we wanted to handle an operation.
- We made the test compile using stubs.
- We ran the test committing horrible sins 😃.
- Gradually, we generalized the working code, replacing constants with variables.
- We added items to our to-do list instead of addressing them all at once.

---

I used two main strategies to make the tests pass quickly:

1. **Fake It**: I start by returning a constant and gradually replacing it with variables until reaching the real code.
2. **Obvious Implementation**: I directly write what I think is the correct implementation.

When I use TDD, I often alternate between these strategies. If everything is clear, I use the Obvious Implementation approach. If a test fails unexpectedly, I switch to "Fake It" and refactor the code until I feel confident, then return to using Obvious Implementations.

### 5 - Franc-ly Speaking

How will we approach the first task? The most interesting test on the list? It still seems like too big a step to take.

I'm not sure I can write a test to implement it in just one small step.

A prerequisite seems to be having an object similar to Dollar but representing Francs.

If we can get the Franc object working the same way as the Dollar object, we will be closer to being able to write and run the mixed addition test.

***<update checklist>***

- [ ]  5CHF * 2 = 10 CHF

So, let's write a test for this:

```jsx
it("should multiply Francs", () => {
  const five = new Franc(5);

  expect(five.times(2).equals(new Franc(10))).to.be.true;

  expect(five.times(3).equals(new Franc(15))).to.be.true;
});
```

What’s the small step that will get us to a green bar? Copying the `Dollar` code and replacing `Dollar` with `Franc`.

```jsx

export class Franc {
  constructor(amount) {
    this.amount = amount;
  }

  times(multiplier) {
    return new Franc(this.amount * multiplier);
  }

}

```

Hold on. Stop for a second. I can feel your thoughts, what you are thinking:

Copying and pasting code? The death of abstraction? The killer of clean design?

Don’t worry, take a deep breath. Relax.

There. Remember, our cycle has different phases (often going by in mere seconds, but they’re still phases):

- Write a test.
- Make it compile.
- Run it to see it fail.
- Make it pass.
- Remove duplication.

The different phases serve different purposes, requiring different solutions and mindsets. The first three phases must pass quickly to reach a stable state.

We can commit any number of “sins” to get there because speed is more important than design, at least for this brief moment.

---

Now, I'd like to point out something fundamental about TDD: doing TDD doesn’t mean turning off your brain and relying only on the tests.

On the contrary, we must always stay alert to the code we're writing.

For example, what happens if I add a test like this:

```jsx

expect(product).to.deep.equals(new Dollar(15));

```

Are `Francs` equal to `Dollars`? No. So, we need to add a function to compare different types of currency.

```jsx

it("should test equality", () => {
  expect(new Franc(5).equals(new Dollar(5))).to.be.false;
});

```

And now we can write the code for the test.

```jsx

equals(other) {
  return other instanceof Dollar && this.amount === other.amount;
}

```

Okay, I allowed myself to abandon all principles of good design and clean code. And you’ll go tell your friends: “Spinelli says all that stuff about design doesn’t matter.” Stop. The cycle is not complete. **The first four steps of the cycle won’t work without the fifth**. Good design at the right time. **Make it work, then make it right**.

---

### 6 - Equality for All

Now we have plenty of duplication and poor-quality code, and we must remove it before moving on to our next tasks. I’d like to start by generalizing the `equals()` method.

***As in the best cooking shows, I pull out the cake that’s already done from the oven, and here’s a more exhaustive test.***

```jsx

it("should test equality", () => {
  expect(new Dollar(5).equals(new Dollar(5))).to.be.true;
  expect(new Dollar(5).equals(new Dollar(6))).to.be.false;

  expect(new Franc(5).equals(new Franc(5))).to.be.true;
  expect(new Franc(5).equals(new Franc(6))).to.be.false;

  expect(new Franc(5).equals(new Dollar(6))).to.be.false;
  expect(new Franc(5).equals(new Dollar(5))).to.be.false;
});

```

To do this, we can create a generic `Money` class and make `Dollar` and `Franc` extend it.

```jsx

class Money {
  constructor(amount) {
    this.amount = amount;
  }

  equals(other) {
    return (
      other instanceof Money &&
      this.amount === other.amount &&
      this.constructor === other.constructor // Ensure both are of the same type
    );
  }
}

```

Here’s the task list:

- [ ]  Remove unnecessary constructor
- [ ]  Create a common `times()` method

### 7 - Times We’re Living In

What’s on our to-do list that might help us eliminate those annoying, unnecessary subclasses? Maybe we could introduce the concept of currency?

How do we want to implement currencies right now? Sorry! **I misspoke. Before you scold me, let me rephrase**: How do we want to test currencies right now? Okay, perfect, we’re in TDD.

We might want to have complex objects representing currencies, with runtime factories to ensure we don’t create more objects than we need. But for now, I think the fastest way (yes! We’re back in the fail-fast, implement-fast phase because we’re starting a new test) is to write a test, and strings will do just fine.

```jsx

it("should use the currency", () => {
  expect("USD").equals(Money.dollar(1).currency);
  expect("CHF").equals(Money.franc(1).currency);
});

```

This is “expressing intent”!

```jsx

export class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  static dollar(amount) {
    return new Dollar(amount);
  }

  static franc(amount) {
    return new Franc(amount);
  }

  equals(other) {
    return (
      other instanceof Money &&
      this.amount === other.amount &&
      this.constructor === other.constructor // Ensure both are of the same type
    );
  }
}

export class Dollar extends Money {
  constructor(amount) {
    super(amount, "USD");
  }

  times(multiplier) {
    return Money.dollar(this.amount * multiplier);
  }
}

export class Franc extends Money {
  constructor(amount) {
    super(amount, "CHF");
  }

  times(multiplier) {
    return Money.franc(this.amount * multiplier);
  }
}

```

**currency equality**

*Add currency to equals: write the test first.*

```jsx
Money {
  equals(
  - this.constructor === other.constructor
  + this.currency === other.currency
}
```

modify `times()`:

```jsx

times(multiplier) {
  return new Money(this.amount * multiplier, "USD");

}

```

Again, I feel like I should tell you something about these very small steps. The question is: Am I really recommending working this way? No. But I am recommending that you **be able to** work this way.

I think now we can update our tests.

```jsx

it("should test equality", () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).to.be.true;
  expect(Money.dollar(5).equals(Money.dollar(6))).to.be.false;

  expect(Money.franc(5).equals(Money.franc(5))).to.be.true;
  expect(Money.franc(5).equals(Money.franc(6))).to.be.false;

  expect(Money.franc(5).equals(Money.dollar(6))).to.be.false;
  expect(Money.franc(5).equals(Money.dollar(5))).to.be.false;
});

```

These are the kinds of adjustments you’ll constantly make with TDD. At this point, I have some considerations:

- Do the tiny steps seem too restrictive? Take bigger steps.
- Feeling a bit unsure? Take smaller steps.

TDD is a guided process: some in one direction, others in another. There is no right size for the steps, whether in a workshop or the real world.

---

With this refactor, another thing becomes evident: Now, in the code, I’m only using `Money`, not the `Dollar` or `Franc` classes. And that’s a good thing; I’m hiding the implementation from the outside.

This is something that came naturally using TDD.

Maybe the test for multiplying `Franc` no longer makes sense. I’ll add it to the task list.

### 8 - Interesting Times

The implementations of `times()` for both dollars and francs are almost identical.

There's no obvious way to make them identical. Sometimes, you have to go backward to go forward, a bit like solving a Rubik’s cube.

---

Instead of spending minutes on debatable reasoning, we can simply ask the computer to make the change and run the tests.

**When I teach TDD, I always see this situation: great programmers spending 5-10 minutes reasoning about a question that the computer could answer in 15 seconds.**

Without tests, you have no choice: you must reason. With tests, you can decide if an experiment would answer the question faster. Sometimes you should just ask the computer.

Okay, at this point, we no longer need the different implementations for `Dollar` and `Franc`. We can unify them into `Money`, using the currency.

```jsx
times(multiplier) {
  return new Money(this.amount * multiplier, this.currency);
}
```

### 9 - The Root of All Evil

The two subclasses, `Dollar` and `Franc`, now only have their constructors. But since a constructor alone is not a sufficient reason to have a subclass, we want to eliminate the subclasses. We can replace the references to the subclasses with references to the superclass without changing the meaning of the code. Let’s start with `Franc`:

```jsx

static dollar(amount) {
  return new Money(amount, "USD");
}

static franc(amount) {
  return new Money(amount, "CHF");
}

```

### 10 - Sum Money

Alright, remember where we want to go? We want to complete this task:

```jsx

$5 + 10 CHF = $10 if rate is 2:1

```

The next step that comes to mind is performing currency addition, so the task will become this, and then we'll add another one for: performing the currency exchange.

- [ ]  $5 + $5 = $10
- [ ]  $5 + 10 CHF = $10 if the rate is 2:1

I think this is simple enough to implement. Let’s write a test!

```jsx

it("should sum money", () => {
  expect(
    Money.dollar(5)
    .plus(Money.dollar(5))
    .equals(Money.dollar(10))
  ).to.be.true;
});

```

Then implement:

```jsx

plus(money) {
  return new Money(this.amount + money.amount, this.currency);
}

```

At this point, we are at a crucial stage of TDD because we’ve created a test and the minimal implementation to make the test pass. But here’s where the developers' experience is important.

**Can you spot the problem here? <someone>?**

I call this the ***apples and oranges problem***. What happens if we sum dollars and francs? Let’s write a test about that.

```jsx

expect(
  Money.dollar(5)
  .plus(Money.franc(5))
  .equals(Money.dollar(10)) // ? what? it doesn't make any sense to me.
).to.be.true;

```

This test passes, but it doesn’t make sense to me.

Now we have a few options:

- Fix it and (for example) throw an exception if the currency is different.
- Create a system to convert the money into different currencies.
- Activate our developer sense and realize that maybe we're doing something wrong and need another entity, not just `money`, but maybe a bank.
- Or, simply, since this is something that shouldn't happen, make it impossible.

**Solution**: remove the money from the sum and only use an amount.

```jsx

// test
expect(Money.dollar(5).plus(5).equals(Money.dollar(10))).to.be.true;

// class
plus(amount) {
  return new Money(this.amount + amount, this.currency);
}

```

This is what sometimes happens when using TDD, and in general. We try to take too big a step.

That is, instead of thinking about the smallest step we can take, we try to reach an abstraction too early, and sometimes this leads us to design errors or complications. But by taking small steps, implementing only what’s strictly necessary, and extending it when needed, we avoid these problems.

### 11 - Change Money

- [ ]  $5 + 10 CHF = $10 if the rate is 2:1

Currency conversion is not something the money itself is aware of, but rather, we should have a bank.

```jsx

it("should change a currency", () => {
  const bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  bank.addRate("USD", "CHF", 0.5);

  const chf = bank.change(Money.dollar(10), "CHF");
  expect(chf.equals(Money.franc(5))).to.be.true;

  const dollars = bank.change(Money.franc(10), "USD");
  expect(dollars.equals(Money.dollar(20))).to.be.true;
});

```

Bank:

```jsx

export class Bank {
  rates = [];

  addRate(from, to, rate) {
    this.rates.push({ from, to, rate });
  }

  change(money, to) {
    const rate = this.findRate(money.currency, to);
    return new Money(money.amount / rate.rate, to);
  }

  findRate(from, to) {
    return this.rates.find((rate) => rate.from === to && rate.to === from);
  }
}

```

Since we’re running out of time, I invite you to continue from here.

### 12 - Final Report Generation Test

Our goal should be to create a test like this and then implement it.

```jsx

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

```

Since I don't know all of your email addresses, I will put on LinkedIn the step-by-step schedule I followed with all the steps so you can review it or follow it.

## Recap:

Today, I shared some reflections on Test-Driven Development (TDD) and the importance of design in the software development process.

In TDD, I follow a cycle made up of five fundamental steps:

1. **Write a test**: Define what you want to test.
2. **Make it compile**: Ensure the test is syntactically correct.
3. **Run the test to see it fail**: It’s essential that the test initially fails.
4. **Make it pass**: Write the minimum code necessary to pass the test.
5. **Remove duplication**: Clean the code and improve the design.

I use two main strategies:

- **Fake It**: Return a constant and replace it with variables.
- **Obvious Implementation**: Write what I think is the correct implementation.

I worked to eliminate the `Dollar` and `Franc` classes, replacing them with a generic `Money` class to reduce duplication.

 I also tackled the **apples-and-oranges problem**

Our goal was to test currency addition, considering exchange rates, but currency management should fall on a bank, not on `Money`.

Closing… 

In summary, design is crucial in TDD, and we must remain open-minded and flexible during the development cycle.

**Key Points of TDD**: if your boss asks what you learned.

- **Small steps**: TDD is based on taking small, manageable steps.
- **Refactor regularly**: Always look for opportunities to improve the code once a feature works.
- **Cycle**: Test, implement, refactor. This keeps the code clean and maintainable.

I think that’s all, thank you very much for your patience, do you have any questions?
