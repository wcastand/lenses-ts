# lenses


## Test

`yarn`

`npx vitest`


## Docs (lolz)


### Proposal 1

```typescript

type Address = {
  name: string
  number: number;
  city: string;
}

type Customer = {
  name: string;
  balance: number;
  address?: Address;
}

const customer:Customer = {
  name: 'John Snow',
  balance: 1000
}

const lCustomerName = prop<Customer, "name">("name")
const lCustomerBalance = prop<Customer, "balance">("balance")
const lCustomerAddress = prop<Customer, "address">("address")

const lAddressNumber = prop<Address, "number">("number")
const lAddressName = prop<Address, "name">("name")

const lCustomerAddressNumber = compose(lCustomerAddress, lAddressNumber)
const lCustomerAddressName = compose(lCustomerAddress, lAddressName)

lCustomerName.get(customer)
lCustomerName.set("new name")(customer)

lCustomerAddressName.get(customer)
```

### Proposal 2

```typescript

type Address = {
  name: string
  number: number;
  city: string;
}

type Customer = {
  name: string;
  balance: number;
  address?: Address;
}

const customer:Customer = {
  name: 'John Snow',
  balance: 1000
}

const lName = prop<string, "name">("name")
const lNumber = prop<number, "number">("number")
const lAddress = prop<Address, "address">("address")
const lBalance = prop<number, "balance">("balance")


const lCustomerAddressNumber = compose(lAddress, lNumber)
const lCustomerAddressName = compose(lAddress, lName)

lName.get(customer)
lName.set("new name")(customer)

lCustomerAddressName.get(customer)
```

### Proposal 3

```typescript

type Address = {
  name: string
  number: number;
  city: string;
}

type Customer = {
  name: string;
  balance: number;
  address?: Address;
}

const customer:Customer = {
  name: 'John Snow',
  balance: 1000
}

const l = init(customer)

const name = l.prop('name').get()
const newC = l.prop('name).set("new name")

const customerAddressName = l.prop('address').prop('name').get()
```
