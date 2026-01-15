import HomePage from '../pages/homepage';
import type { TestWorld } from './testWorld';

export class PageFactory {
  constructor(private readonly world: TestWorld) {}

  home() {
    return new HomePage(this.world.page, this.world.uiActions);
  }
}
