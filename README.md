# storage-cover
Web Storage might not work because its implementation(e.g. incognito mode) is different by browsers. So developers should take these different implementations into account.

```storage-cover``` is great solution for resolving this issue. ```storage-cover``` wraps Web Storage to prevent unexpected error and keep your web application continuous.

- zero dependencies
- easy to use
- support SSR

```typescript
import { wrapLocalStorage, wrapSessionStorage } from "storage-cover";

export const localStorage = wrapLocalStorage();
export const sessionStorage = wrapSessionStorage();
```

```typescript
localStorage.set("SOME_KEY", "Hello, World!");
console.log(localStorage.get("SOME_KEY")); // Hello, World!
```
