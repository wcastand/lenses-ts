# lenses


## Test

`yarn`

`npx vitest`


## Docs (lolz)


### Lens

```typescript

type Address = {
  street: string;
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

const lName = lens<string>('name')

// If no type given, will infer from param, careful if you send bad data
lName.get(customer) // 'John Snow'
lName.get({}) // will throw and error at runtime since it infer (type your things)


lName.get<Customer>(customer) // 'John Snow'
lName.get<Customer>({}) // Typscript will cry
```
