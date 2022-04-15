# storage-cover
Web Storage might not work because its implementation(e.g. incognito mode) is different by browsers. So developers should take these different implementations into account.

```storage-cover``` is great solution for resolving this issue. ```storage-cover``` wraps Web Storage to prevent unexpected error and keep your web application continuous.

```typescript
import StorageCover from "storage-cover";

export const localStorage = StorageCover.createLocal();
export const sessionStorage = StorageCover.createSession();
```

```typescript
localStorage.set("SOME_KEY");
console.log(localStorage.get(""));
```
