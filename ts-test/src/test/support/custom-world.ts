// import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
// import { Browser, BrowserContext, Page } from "@playwright/test";
// import { AllPagesObject } from "../pages/all-pages-objects";

// export interface ICustomWorld extends World {
//   page?: Page;
//   browser?: Browser;
//   context?: BrowserContext;
//   pagesObj?: AllPagesObject;
// }

// export class CustomWorld extends World implements ICustomWorld {
//   constructor(options: IWorldOptions) {
//     super(options);
//   }
//   context?: BrowserContext | undefined;
//   page?: Page | undefined;
//   pagesObj?: AllPagesObject | undefined;
//   debug = false;
// }

// setWorldConstructor(CustomWorld);
