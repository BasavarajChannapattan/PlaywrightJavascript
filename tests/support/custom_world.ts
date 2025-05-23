import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { BrowserContext, Page } from "@playwright/test";

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
  context?: BrowserContext;
  page?: Page;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
  context?: BrowserContext | undefined;
  page?: Page | undefined;
}

setWorldConstructor(CustomWorld);
