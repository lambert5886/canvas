
    (function(window) {
        var Vector2 = function(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        };
        Vector2.prototype = {
            set: function(x, y) {
                this.x = x;
                this.y = y;
                return this;
            },
            sub: function(v) {
                return new Vector2(this.x - v.x, this.y - v.y);
            },
            multiplyScalar: function(s) {
                this.x *= s;
                this.y *= s;
                return this;
            },
            divideScalar: function(s) {
                if (s) {
                    this.x /= s;
                    this.y /= s;
                } else {
                    this.set(0, 0);
                }
                return this;
            },
            length: function() {
                return Math.sqrt(this.lengthSq()); // 开平方
            },
            normalize: function() {
                return this.divideScalar(this.length());
            },
            lengthSq: function() {
                return this.x * this.x + this.y * this.y;
            },
            distanceToSquared: function(v) {
                var dx = this.x - v.x,
                        dy = this.y - v.y;
                return dx * dx + dy * dy;
            },
            distanceTo: function(v) {
                return Math.sqrt(this.distanceToSquared(v));
            },
            setLength: function(l) {
                return this.normalize().multiplyScalar(l);
            }
        };
        window.Vector2 = Vector2;
    } (window));

    (function(window){
        var MathHelp = {} ;

        MathHelp.getRandomNumber = function(min, max) {
            return (min + Math.random() * ( max - min + 1 )) ;
        };

        window.MathHelp = MathHelp ;
    }(window));

    (function(window){
        var Ball = function(r, v, p, cp) {
            this.radius = r ;
            this.velocity = v ;
            this.position = p ;
            this.collectionPosition = cp ;
        };

        Ball.prototype = {
            collection : function(v) {
                this.velocity = this.collectionPosition.sub(this.position).setLength(v) ;
            },
            disband : function() {
              this.velocity = 
               new Vector2(MathHelp.getRandomNumber(-230, 230), MathHelp.getRandomNumber(-230, 230)) ;
            }
        };

        window.Ball = Ball ;
    }(window));

   
    var ps = [] ;
    var balls = [] ;
    var canvas = document.getElementById("canvas") ;
   // console.log("width: " + canvas.width + " height: " + canvas.height) ;
    function init(tex) {
        balls.length = 0 ;
        ps.length = 0 ;

        var ctx = canvas.getContext('2d') ;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000000" ;
        ctx.fillRect(0, 0, canvas.width, canvas.height) ;
        ctx.fillStyle = "#ffffff" ;
        ctx.font = "bolder 100px microsoft YaHei" ;
        ctx.textBaseline = "top" ;
        ctx.fillText(tex, 100, 150) ; //绘制文字

        for( var i = 1; i < canvas.width; i = i + 2) { //循环出字体各个点坐标;
            for( var j = 1 ; j < canvas.height; j = j + 2 ) {
                imageData = ctx.getImageData(100+i, 150+j, 1, 1) ;

                if( imageData.data[0] > 100 ) {
                    ps.push({
                        px:100 + i,
                        py:150 + j
                    }) ;
                }
            }
        }

        ctx.fillStyle = "black" ;
        ctx.fillRect(170, 150, canvas.width, canvas.height) ;

        
        for( var i = 0 ; i < ps.length ; i ++ ) {
            var ball = 
             new Ball(1, new Vector2(0 ,0), new Vector2(ps[i].px,ps[i].py), 
                        new Vector2(ps[i].px,ps[i].py)) ;
            balls.push(ball) ;

            
        }
        var ballsLen = balls.length;
        let  colorsAll = [];
        var cishu = parseInt(ballsLen/colors.length);
      
        while(cishu !== -1){
                cishu--;
                for(var i = 0; i < colors.length; i++){
                    colorsAll.push(colors[i]);
                }

        }


       

        ctx.fillStyle = "#ffffff" ;

         for( let i = 0 ; i < balls.length ; i ++ ) {

              
                ctx.beginPath() ;
                ctx.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, Math.PI*2, true) ;
                ctx.fillStyle = colorsAll[i];
                ctx.closePath() ;
                
               //  console.log(colorsAll[i])
                ctx.fill() ;
            }


       

        for( var i in balls ) {
            balls[i].disband() ;
        }
    }  //初始化

    init("Resume") ;

    var time = 0 ;
    var cyc = 15 ;
    var a = 80 ;
    var collectionCMD = false ;
    var width = canvas.width ;
    var height = canvas.height ;

    setInterval(function(){
        var ctx = canvas.getContext('2d') ;
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)" ;
        ctx.fillRect(0, 0, canvas.width, canvas.height) ;
       

        var ballsLen = balls.length;
        let  colorsAll = [];
        var cishu = parseInt(ballsLen/colors.length);
     
        while(cishu !== -1){
                cishu--;
                for(var i = 0; i < colors.length; i++){
                    colorsAll.push(colors[i]);
                }

        }

        time = time + cyc ;

        for( var i in balls ) {
            if( collectionCMD === true 
                && balls[i].position
                           .distanceTo(
                                balls[i]
                                .collectionPosition) < 2 ) {
                balls[i].velocity.x = 0 ;
                balls[i].velocity.y = 0 ;
            }
              
        }

        if( time === 3000 ) {
            collectionCMD = true ;
            for( var i in balls ) {
                balls[i].collection(230) ;
            }
        }

        if( time === 7500 ) {
            time = 0 ;
            collectionCMD = false ;
            for( var i in balls ) {
                balls[i].disband() ;
            }
        }

        for( var i in balls ) {
            ctx.beginPath() ;
            ctx.arc(balls[i].position.x, balls[i].position.y, 
                balls[i].radius, 0, Math.PI*2, true) ;
            ctx.fillStyle = colorsAll[i];
            ctx.closePath() ;
            ctx.fill() ;

            balls[i].position.x = balls[i].position.x +
                                 balls[i].velocity.x * cyc / 1000 ;
            balls[i].position.y = balls[i].position.y +
                                 balls[i].velocity.y * cyc / 1000 ;

            if( balls[i].position.x < 2 || 
                balls[i].position.x > width - 2 ) {
                balls[i].velocity.x *= -1 ;
            }
            if( balls[i].position.y < 2 || 
                balls[i].position.y > height - 2 ) {
                balls[i].velocity.y *= -1 ;
            }
        }
    }, cyc) ;
