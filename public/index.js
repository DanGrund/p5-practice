let sound, peakDetect, ellipseWidth;
preload = () => {
  sound = loadSound('assets/flyLikeLove.mp3');
}

setup = () => {
  let canvas = createCanvas(displayWidth, .8*displayHeight);
  canvas.mouseClicked(togglePlay);
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(20,20000,0.1);
  sound.amp(0.2);
}

draw = () => {
  clear();
  background(0);
  noStroke();

  fft.analyze();


  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke('rgba(255,43,56, 0.9)');
  strokeWeight(3);
  for (let i = 0; i < waveform.length; i += 50) {
    //waveform length is 1024
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -.5, .5, 0, height);
    vertex(x,y);
  }
  endShape();

  // get energy "lowMid", "mid", "highMid", "treble"
  let bass = fft.getEnergy('bass')
  let lows = fft.getEnergy('lowMid')
  let mids = fft.getEnergy('mid')
  let upperMids = fft.getEnergy('highMid')
  let treble = fft.getEnergy('treble')


  //bars for the five major 'energies'
  noStroke();
  fill('rgba(255,43,56, 0.7)');
  rect(0, displayHeight, displayWidth/5, -(displayHeight/255)*bass);
  fill('rgba(185,43,56, 0.8)');
  rect(displayWidth/5, displayHeight, (displayWidth/5), -(displayHeight/255)*lows);
  fill('rgba(135,43,56, 0.8)');
  rect((displayWidth/5)*2, displayHeight, (displayWidth/5), -(displayHeight/255)*mids);
  fill('rgba(185,43,56, 0.8)');
  rect((displayWidth/5)*3, displayHeight, (displayWidth/5), -(displayHeight/255)*upperMids);
  fill('rgba(255,43,56, 0.7)');
  rect((displayWidth/5)*4, displayHeight, (displayWidth/5), -(displayHeight/255)*treble);

  peakDetect.update(fft);
  if ( peakDetect.isDetected ) {
    ellipseWidth = height/1.25;
  } else {
    ellipseWidth *= 0.95;
  }
  stroke('rgba(255,0,56, 0.7)');
  noFill()
  ellipse(width/2, height/2, ellipseWidth, ellipseWidth);

}



togglePlay = () => {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
