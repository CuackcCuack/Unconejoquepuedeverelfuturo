var typed = new Typed('.typed',{
    strings: ['', 'Hey','Cuida a tántalo de las criaturas malignas y de los depredadores',
    'Hemos jurado protegerlo a toda costa, pues el puede ver el futuro', 'Para defenderlo:',
    'Dibuja las formas que los depredadores tengan para eliminarlos, recuerda que no pueden tocarte a ti ni a el',
    'Buena suerte'],
    typeSpeed: 75, //tiempo para para poner letras
    startDelay: 1200, //tiempo de retraso para iniciar
    backDelay: 1000, //Tiempo de espera para borrar
    backSpeed: 35, //Velocidad para borrar
    loopCount: false, //repetir infinitamente
    showCursor: true, //Mostrar cursor palpitando
});

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let startButton;
let isPlaying = false;
let score = 0;

function startGame() {
    //Crear a tántalo y rin
    let rabbit = {
        x: 460,
        y: 300,
        radius: 15,
        color: "#F9E6C1"
    };
    let samurai = {
        x: 500,
        y: 300,
        width: 30,
        height: 50,
        color: "#4A3933"
    };
    //Depredadores
    let predators = [];
    let predatorColors = ["#F44336", "#9C27B0", "#2196F3", "#FFEB3B", "#4CAF50", "#00BCD4"];
    let predatorSpeeds = [3, 4, 5, 6, 7, 8, 9];
    let predatorSizes = [30, 40, 50, 60, 70];
    let predatorInterval = setInterval(function() {
        let predator = {
            x: Math.floor(Math.random() * 900) + 100,
            y: Math.floor(Math.random() * 720) + 50,
            color: predatorColors[Math.floor(Math.random() * predatorColors.length)],
            speed: predatorSpeeds[Math.floor(Math.random() * predatorSpeeds.length)],
            size: predatorSizes[Math.floor(Math.random() * predatorSizes.length)],
            shape: getShape()
        };
        predators.push(predator);
    }, 80);

    //Dibujar a Tántalo y Rin
    drawRabbit(rabbit);
    drawSamurai(samurai);

    //Dibujar depredadores
    let predatorIntervalId = setInterval(function() {
        if (!isPlaying) {
            clearInterval(predatorInterval);
            clearInterval(predatorIntervalId);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRabbit(rabbit);
        drawSamurai(samurai);
        movePredators(predators);
        drawPredators(predators);
    }, 2000);

    // Event listeners
    canvas.addEventListener("mousedown", function(event) {
        let x = event.clientX - canvas.offsetLeft;
        let y = event.clientY - canvas.offsetTop;
        for (let i = 0; i < predators.length; i++) {
            let predator = predators[i];
            if (x > predator.x && x < predator.x + predator.size && y > predator.y && y < predator.y + predator.size) {
                if (checkShape(predator.shape)) {
                    predators.splice(i, 1);
                    score += 10;
                } else {
                    isPlaying = false;
                    clearInterval(predatorInterval);
                    clearInterval(predatorIntervalId);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawGameOver();
                }
            }
        }
    });

    canvas.addEventListener("mousemove", function(event) {
        if (isPlaying) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRabbit(rabbit);
            drawSamurai(samurai);
            movePredators(predators);
            drawPredators(predators);
            drawLine(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, samurai);
        }
    });

    canvas.addEventListener("mouseup", function(event) {
        if (isPlaying) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRabbit(rabbit);
            drawSamurai(samurai);
            movePredators(predators);
            drawPredators(predators);
            drawLine(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, samurai);
        }
    });

    //No me acuerdo que hacen la verdad pero si las quitas no compila JAJAJA
    function drawRabbit(rabbit) {
        ctx.beginPath();
        ctx.arc(rabbit.x, rabbit.y, rabbit.radius, 0, Math.PI * 2);
        ctx.fillStyle = rabbit.color;
        ctx.fill();
        ctx.closePath();
    }

    function drawSamurai(samurai) {
        ctx.fillStyle = samurai.color;
        ctx.fillRect(samurai.x - samurai.width / 2, samurai.y - samurai.height / 2, samurai.width, samurai.height);
    }

    function movePredators(predators) {
        for (let i = 0; i < predators.length; i++) {
            let predator = predators[i];
            if (predator.x > rabbit.x) {
                predator.x -= predator.speed;
            } else {
                predator.x += predator.speed;
            }
            if (predator.y > rabbit.y) {
                predator.y -= predator.speed;
            } else {
                predator.y += predator.speed;
            }
        }
    }

    function drawPredators(predators) {
        for (let i = 0; i < predators.length; i++) {
            let predator = predators[i];
            ctx.fillStyle = predator.color;
            ctx.fillRect(predator.x, predator.y, predator.size, predator.size);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px Arial";
            ctx.fillText(predator.shape, predator.x + predator.size / 2 - 8, predator.y + predator.size / 2 + 6);
        }
    }

    function drawLine(x, y, samurai) {
        ctx.beginPath();
        ctx.moveTo(samurai.x, samurai.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    function getShape() {
        let shapes = ["▲", "■", "◆", "●"];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    function checkShape(shape) {
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(canvas);
        selection.removeAllRanges();
        selection.addRange(range);
        let clientRects = selection.getClientRects();
        for (let i = 0; i < clientRects.length; i++) {
            let clientRect = clientRects[i];
            if (clientRect.width > 0 && clientRect.height > 0) {
                let elementX = clientRect.left + clientRect.width / 2;
                let elementY = clientRect.top + clientRect.height / 2;
                if (elementX > samurai.x - samurai.width / 2 && elementX < samurai.x + samurai.width / 2 && elementY > samurai.y - samurai.height / 2 && elementY < samurai.y + samurai.height / 2) {
                    let text = selection.toString();
                    selection.removeAllRanges();
                    return text === shape;
                }
            }
        }
        selection.removeAllRanges();
        return false;
    }

    function drawGameOver(canvas) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
        ctx.font = "bold 20px Arial";
        ctx.fillText("Your score is " + score, canvas.width / 2 - 80, canvas.height / 2 + 40);
    }

}