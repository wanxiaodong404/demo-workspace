;(function(w,d){
    const container = d.querySelector('#demo');
    const playIcon = require('./assets/img/play.jpg')
	const loadIcon = require('./assets/img/loading.png');
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
				const stop = this.loading();
                xhr.onload = function() {
					that.ac.decodeAudioData(xhr.response, (buffer) => {
						stop();
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
			const size = 50;
            const left = (this.width - size) / 2;
            const top = (this.height - size) / 2;
            const img = new Image();
            img.src = playIcon;
            img.onload = (res) => {
				const {naturalHeight, naturalWidth} = res.currentTarget;
                this.ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight, left, top, size, size)
            }
        }
		loading() {
			const img = new Image();
			const size = 50;
			let imgWidth, imgHeight, left, top;
            img.src = loadIcon;
			let loading = false;
            img.onload = (res) => {
				loading = true;
				const {naturalHeight, naturalWidth} = res.currentTarget;
				imgWidth = naturalWidth
				imgHeight = naturalHeight
				left = (this.width - size) / 2;
            	top = (this.height - size) / 2;
				update();
            };
			let state = null;
			const update = () => {
				const edg = 0.1;
				this.ctx.clearRect(-size, -size, this.width, this.height);
				if (!state) {
					this.ctx.save();
					state = 1;
					this.ctx.translate(this.width / 2, this.height / 2);
				}
				this.ctx.rotate(edg)
                this.ctx.drawImage(img, 0, 0, imgWidth, imgHeight, -size/2, -size/2, size, size);
				if (loading) {
					requestAnimationFrame(update);
				} else {
					// 复原角度
					this.ctx.restore()
				}
			}
			return () => {
				loading = false;
			};
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