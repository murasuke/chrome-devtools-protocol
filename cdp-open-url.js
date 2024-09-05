import CDP from 'chrome-remote-interface';

async function openURL() {
  let client;
  try {
    // Chromeに接続
    client = await CDP();

    // 必要な機能を有効化
    const { Page, Runtime } = client;
    await Page.enable();
    await Runtime.enable();

    // 指定したURLを開く
    const url = 'https://example.com';
    await Page.navigate({ url });
    await Page.loadEventFired(); // 読み込み完了を待つ

    // <h1>を赤くする
    const expression = `document.querySelector('h1').style.color = 'red'`;
    await Runtime.evaluate({ expression });
  } catch (err) {
    console.error(err);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

openURL();
