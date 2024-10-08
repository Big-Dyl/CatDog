import React from 'react';
import * as tf from '@tensorflow/tfjs';
import './App.css';
async function loadmodel(){
  const model = await tf.loadLayersModel(process.env.PUBLIC_URL + '/my_model/model.json');
  return model;
}
function input(){
  let file = (document.getElementById("file") as HTMLInputElement).files;
  (document.getElementById("image") as HTMLDivElement).innerHTML = "";
  if(!file){
    return;
  }
    let img = document.createElement('img');
    let predict = document.createElement('p');
    img.src = URL.createObjectURL(file[0]);
    img.style.height = '500px';
    img.style.marginBottom = '10px';
    loadmodel().then((model) =>{
      let cat = tf.browser.fromPixels(img, 3);
      cat = tf.image.resizeBilinear(cat, [128, 128]);
      cat = tf.image.rgbToGrayscale(cat);
      cat = cat.div(255);
      const prediction = (model.predict(tf.stack([cat])) as tf.Tensor).dataSync();
      if(prediction[0] > prediction[1]){
        predict.innerHTML = `I am ${prediction[0] * 100}% sure that is a dog`
      } else {
        predict.innerHTML = `I am ${prediction[1] * 100}% sure that is a cat`
      }
      (document.getElementById("image") as HTMLDivElement).appendChild(img);
      (document.getElementById("image") as HTMLDivElement).appendChild(predict);
  })
}

function App() {
  return (
    <div className="App">
        <h1>UPLOAD A PICTURE HERE!</h1>
        <input id = "file" type="file" name="file" accept='.jpg' onChange={()=>{input()}}></input>
        <div id = "image" style = {{textAlign: 'center'}}>

        </div>
    </div>
  );
}

export default App;
