import { GamesGetAssetsFile } from './get_assets.js';
export default async function LoadImageFromArray(ImageArray,GameID) {
    let Images = [];
  
    // 定義載入圖片的 Promise 函式
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }
    
    // 遞迴函式處理任意維度的陣列
    async function processArray(arr) {
      let result = [];
      for (let item of arr) {
        if (Array.isArray(item)) {
          result.push(await processArray(item));
        } else {
          try {
            let img = await loadImage(GamesGetAssetsFile(GameID, item));
            result.push(img);
          } catch (error) {
            console.error('圖片載入失敗：', error);
          }
        }
      }
      return result;
    }
  
    Images = await processArray(ImageArray);
    return Images;
  }