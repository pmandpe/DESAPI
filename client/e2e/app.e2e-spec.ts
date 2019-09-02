import { DESCLIENTPage } from './app.po';

describe('desclient App', function() {
  let page: DESCLIENTPage;

  beforeEach(() => {
    page = new DESCLIENTPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
