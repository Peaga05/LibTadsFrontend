import { LibTadsTemplatePage } from './app.po';

describe('LibTads App', function() {
  let page: LibTadsTemplatePage;

  beforeEach(() => {
    page = new LibTadsTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
