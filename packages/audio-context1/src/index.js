;(function(w,d){
    const container = d.querySelector('#demo');
    const playIcon = require('./assets/img/play.jpg')
    class Music {
        constructor(dom) {
            this.root = typeof dom === 'string' ?  d.querySelector(dom): dom;
            this.inzit()
        }
        inzit() {
            this.getSize();
            const canvas = this.createCanvas();
            this.root.innerHTML =''
            this.root.appendChild(canvas);
            this.ctx = canvas.getContext('2d');
            this.ac = new AudioContext();
        }
        createCanvas() {
            const canvas = d.createElement('canvas');
            const devicePixelRatio = this.devicePixelRatio;
            canvas.width = this.width * devicePixelRatio;
            canvas.height = this.height * devicePixelRatio;
            canvas.style = 'width:100%;height:100%';
            return canvas
        }
        getSize() {
            const root = this.root;
            this.width = root.clientWidth
            this.height = root.clientHeight
            this.devicePixelRatio = w.devicePixelRatio || 1;
        }
        playAudio(url) {
                const xhr = new XMLHttpRequest();
                const that = this;
                xhr.responseType = 'arraybuffer'
                xhr.open('get',url)
                xhr.onload = function() {
                    that.ac.decodeAudioData(xhr.response, (buffer) => {
                        that.loadAudio(buffer)
                    })
                }
                xhr.onerror = function(e) {
                    reject(e)
                }
                xhr.send()
        }
        loadAudio(buffer) {
            const sourceNode = this.ac.createBufferSource();
            const analyNode = this.ac.createAnalyser();
            analyNode.fftSize = 256;
            sourceNode.connect(analyNode)
            sourceNode.connect(this.ac.destination);
            sourceNode.buffer = buffer;
            sourceNode.start(0);
            this.drawAudio(analyNode)
        }
        drawAudio(analyNode) {
            this.analyNode = analyNode;
            this.isPlay = true;
            const that = this;
            const ctx = this.ctx;
            const width = this.width * this.devicePixelRatio;
            const height = this.height * this.devicePixelRatio;
            let frame = 0;
            function update() {
                const arr = new Uint8Array(analyNode.frequencyBinCount);
                analyNode.getByteFrequencyData(arr)
                const step = parseInt(arr.length / 40);
                ctx.clearRect(0,0,width,height);
                for (var i = 0; i < 40; i++) {
                    var energy = (arr[step * i] / 256.0) * 50;
                    for (var j = 0; j < energy; j++) {
                        ctx.beginPath();
                        ctx.moveTo(20 * i + 2, 200 + 4 * j);
                        ctx.lineTo(20 * (i + 1) - 2, 200 + 4 * j);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(20 * i + 2, 200 - 4 * j);
                        ctx.lineTo(20 * (i + 1) - 2, 200 - 4 * j);
                        ctx.stroke();
                    }
                    ctx.beginPath();
                    ctx.moveTo(20 * i + 2, 200);
                    ctx.lineTo(20 * (i + 1) - 2, 200);
                    ctx.stroke();
                }
                frame++
                that.isPlay && requestAnimationFrame(update)
            }
            requestAnimationFrame(update)
        }
        ready() {
            const imgWidth = 194;
            const left = (this.width - imgWidth) / 2;
            const top = (this.height - imgWidth) / 2;
            const img = new Image();
            img.src = playIcon;
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, imgWidth, imgWidth, left, top, 50, 50)
            }
        }
    }
    const demo = w.test = new Music(container)
    const audioList = [
        './assets/audio/爱啦啦.mp3',
        './assets/audio/bbc_sherlock_openning.mp3',
        './assets/audio/Neptune Illusion Dennis Kuo .mp3',
        './assets/audio/单曲Remix ┃ 爱上这个女声 放进专辑里私藏 夜电播音员.mp3',
    ]
    const index = Math.round(Math.random() * (audioList.length - 1));
    function start() {
        demo.playAudio(audioList[index]);
        demo.root.removeEventListener('click', start)
    }
    demo.ready()
    demo.root.addEventListener('click', start)
})(window,document)