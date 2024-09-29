import CDP from 'chrome-remote-interface';
async function callGemini(question) {
  let client;
  try {
    // Chromeに接続
    client = await CDP();

    // 必要な機能を有効化
    const { Page, Runtime } = client;
    await Page.enable();
    await Runtime.enable();

    // gemini nanoを呼び出して結果を待つ
    const expression = `
      (async function() {
        const session = await window.ai.createTextSession();
        const message = await session.prompt("${question}");
        return message;
      })();
    `;
    console.log(expression);
    const result = await Runtime.evaluate({
      expression,
      awaitPromise: true, // 非同期処理を待つ
    });

    // 実行結果を表示
    console.log('result:', result.result.value);
  } catch (err) {
    console.error(err);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

if (process.argv.length == 3) {
  callGemini(process.argv[2]);
}
