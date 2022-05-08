//取范围内随机数
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
}

class Prey {
    /**
     * 初始化猎物对象并加入到body中
     * name string 猎物名
     * id string 唯一id
     * enclosure object 围栏范围
     * img string 图片路径
     * speed int 速度
     */
    join(name, id, enclosure, img, speed) {
        this.name = name;
        this.enclosure = enclosure;
        this.id = id;
        let pic = '<img title="' + name + '" id="' + id + '" src="' + img + '" onclick="pipipi()"></img>';
        document.getElementById("game").innerHTML = document.getElementById("game").innerHTML + pic;
        let obj = document.getElementById(id);
        obj.style.left = randomNum(this.enclosure.x1, this.enclosure.x2) + 'px';
        obj.style.top = randomNum(this.enclosure.y1, this.enclosure.y2) + 'px';
        this.speed = speed;
        this.setTarget();
    }
    
    //重新设置终点
    setTarget() {
        let obj = document.getElementById(this.id);
        let rect = obj.getBoundingClientRect();
        let w = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        let h = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
        w = w - obj.clientWidth;
        h = h - obj.clientHeight;
        this.target = {
            x: randomNum(this.enclosure.x1, this.enclosure.x2 > w ? w : this.enclosure.x2),
            y: randomNum(this.enclosure.y1, this.enclosure.y2 > h ? h : this.enclosure.y2)
        };
        let x = Math.abs(this.target.x - rect.left);
        let y = Math.abs(this.target.y - rect.top);
        let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)); //直角三角形求斜边

        //xy步进值，带方向
        this.runSpeed = {
            x: Math.floor(Math.ceil(this.speed) / z * x * (this.target.x > rect.left ? 1 : -1)),
            y: Math.floor(Math.ceil(this.speed) / z * y * (this.target.y > rect.top ? 1 : -1))
        };

    }

    //运动
    motion() {
        /*
        运动算法两种思路
        一种设置目标点，定向移动，同时设计围栏，撞上围栏重新生成目标点
        或者直接左右移动，要简单很多
        下面是多方向移动算法
        */
        let toX, toY;
        let obj = document.getElementById(this.id);
        let rect = obj.getBoundingClientRect();
        let w = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        let h = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
        if (
            rect.x - this.runSpeed.x <= this.enclosure.x1 || rect.x + this.runSpeed.x >= this.enclosure.x2 ||
            rect.y - this.runSpeed.y <= this.enclosure.y1 || rect.y + this.runSpeed.y >= this.enclosure.y2 || //判断是否逃出围栏
            rect.x - this.runSpeed.x <= 0 || rect.x - this.runSpeed.x >= w ||
            rect.y - this.runSpeed.y <= 0 || rect.y - this.runSpeed.y >= h || //判断是否逃出浏览器窗口范围
            Math.abs(this.target.x - rect.x) <= Math.abs(this.runSpeed.x) ||
            Math.abs(this.target.y - rect.y) <= Math.abs(this.runSpeed.y) //到达终点
        ) {
            //即将逃出围栏，重新设定目标点
            this.setTarget();
        }

        //console.log(obj, rect);
        toX = Math.floor(rect.left + this.runSpeed.x);
        toY = Math.floor(rect.top + this.runSpeed.y);
        //console.log(this.id, obj.style.left, toX, toY);
        obj.style.left = toX + "px";
        obj.style.top = toY + "px";
    }

    //死亡
    die() {
        document.getElementById(this.id).remove();
    }
}
//定于全局变量
let animal = new Array();

//body加载完成后加入猎物并创建时钟
window.onload = function () {
    for (let i = 0; i < 10; i++) {
        animal.splice(0, 0, new Prey());
        animal[0].join(
            "bird",
            "bird" + i, {
                x1: 100,
                x2: 1000,
                y1: 200,
                y2: 500
            }, "./1.gif",
            5);
    }
    animal.splice(0, 0, new Prey());
    animal[0].join(
        "pig",
        "pig0", {
            x1: 50,
            x2: 500,
            y1: 50,
            y2: 1000
        }, "./2.jpeg",
        30);
    setInterval("run()", 20);
}

function run() {
    //console.log(animal.length);
    for (let i = 0; i < animal.length; i++) {
        animal[i].motion();
    }
}

function pipipi(from) {
    let e = window.event;
    for (let i = 0; i < animal.length; i++) {
        if (animal[i].id == e.target.id) {
            //死亡
            console.log(i);
            alert("你抓住了" + animal[i].name);
            animal[i].die();
            animal.splice(i, 1);
        }
    }
}