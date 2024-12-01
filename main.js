// Global Variables
let data = [];
let perceptronWeights = [0.1, 0.1];
let bias = 0.1;
let learningRate = 0.1;
let score = 0;
let misclassifiedPoints = [];

// Dark Humor Quotes
const darkComedyQuotes = [
  "🌹 Flowers are temporary; decisions are forever.",
  "🌷 Roses are red, violets are blue, separating flowers is what we do.",
  "🌹 If this doesn't work, try bribing the flowers.",
  "🌷 Who needs therapy when you can train perceptrons?",
  "🌹 Keep separating. It's all downhill from here.",
  "🌷 Flowers vs. AI – who's going to win?",
  "🌹 The flowers know you’re trying your best… or do they?",
  "🌷 Every misclassified flower haunts your dreams.",
];

// Toggle Dark Mode
const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
};

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;

// Generate Linearly Separable Dataset
function generateData() {
  data = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 10;
    const y = Math.random() * 10;
    const label = x + y > 10 ? 1 : -1;
    data.push({ x, y, label });
  }
}

// Draw Scatter Plot
function drawScatterPlot() {
  const width = 600;
  const height = 400;

  const container = document.getElementById("scatterplot");
  container.innerHTML = "";

  const xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

  misclassifiedPoints = []; // Reset misclassified points

  data.forEach(point => {
    const img = document.createElement("img");
    img.src = point.label === 1 ? "./assets/rose.png" : "./assets/tulip.png";
    img.className = "flower";
    img.style.left = `${xScale(point.x)}px`;
    img.style.top = `${yScale(point.y)}px`;

    const prediction = predict(point.x, point.y);
    if (prediction !== point.label) {
      img.style.border = "2px solid red"; // Highlight misclassified points
      misclassifiedPoints.push(point);
    }

    container.appendChild(img);
  });

  return { xScale, yScale, container };
}

// Update Decision Boundary
function updateDecisionBoundary(scales) {
  const { xScale, yScale } = scales;

  let line = document.getElementById("decisionBoundary");
  if (!line) {
    line = document.createElement("div");
    line.id = "decisionBoundary";
    line.style.position = "absolute";
    line.style.height = "2px";
    line.style.backgroundColor = "green";
    document.getElementById("scatterplot").appendChild(line);
  }

  const xMin = 0;
  const xMax = 10;
  const yMin = (-perceptronWeights[0] * xMin - bias) / perceptronWeights[1];
  const yMax = (-perceptronWeights[0] * xMax - bias) / perceptronWeights[1];

  const x1Scaled = xScale(xMin);
  const y1Scaled = yScale(yMin);
  const x2Scaled = xScale(xMax);
  const y2Scaled = yScale(yMax);

  line.style.left = `${x1Scaled}px`;
  line.style.top = `${Math.min(y1Scaled, y2Scaled)}px`;
  line.style.width = `${Math.hypot(x2Scaled - x1Scaled, y2Scaled - y1Scaled)}px`;
  line.style.transform = `rotate(${Math.atan2(y2Scaled - y1Scaled, x2Scaled - x1Scaled)}rad)`;
  line.style.transformOrigin = "left center";
}

// Train Perceptron
function trainPerceptron() {
  for (let epoch = 0; epoch < 1000; epoch++) {
    let errorCount = 0;

    data.forEach(point => {
      const prediction = predict(point.x, point.y);
      const error = point.label - prediction;

      if (error !== 0) {
        perceptronWeights[0] += learningRate * error * point.x;
        perceptronWeights[1] += learningRate * error * point.y;
        bias += learningRate * error;
        errorCount++;
      }
    });

    console.log(`Epoch ${epoch + 1}: Errors = ${errorCount}`);

    if (errorCount === 0) break;
  }

  const scales = drawScatterPlot();
  updateDecisionBoundary(scales);

  document.getElementById("quote").innerText =
    darkComedyQuotes[Math.floor(Math.random() * darkComedyQuotes.length)];
  displayFeatureImportance();
}

// Predict
function predict(x, y) {
  return x * perceptronWeights[0] + y * perceptronWeights[1] + bias >= 0 ? 1 : -1;
}

// Test Perceptron
function testPerceptron() {
  let correct = 0;

  data.forEach(point => {
    if (predict(point.x, point.y) === point.label) correct++;
  });

  const accuracy = (correct / data.length) * 100;
  document.getElementById("accuracy").innerText = `Accuracy: ${accuracy.toFixed(2)}%`;
  score += Math.round(accuracy);
  document.getElementById("score").innerText = `Score: ${score}`;

  if (accuracy < 80) {
    alert("Hint: Try adjusting the learning rate or adding more training epochs!");
  }
}

// Reset Game
function resetGame() {
  perceptronWeights = [0.1, 0.1];
  bias = 0.1;
  generateData();
  const scales = drawScatterPlot();
  updateDecisionBoundary(scales);
  document.getElementById("accuracy").innerText = "Accuracy: 0.00%";
  document.getElementById("score").innerText = "Score: 0";
}

// Display Feature Importance
function displayFeatureImportance() {
  const container = document.getElementById("featureWeights");
  container.innerHTML = ""; // Clear existing content

  const features = ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"];
  const weights = perceptronWeights;

  features.forEach((feature, index) => {
    const bar = document.createElement("div");
    bar.style.width = `${Math.abs(weights[index % 2] || 0) * 50}px`;
    bar.style.backgroundColor = "blue";
    bar.style.margin = "10px 0";
    bar.textContent = `${feature}: ${Math.abs(weights[index % 2] || 0).toFixed(2)}`;
    container.appendChild(bar);
  });
}

// Advanced 3D Visualization Placeholder
function visualize3DDecisionBoundary() {
  alert("3D visualization is under construction. Stay tuned!");
}

// Initialize Game
generateData();
const scales = drawScatterPlot();
updateDecisionBoundary(scales);

function uploadDataset() {
    const fileInput = document.getElementById("uploadDataset");
    fileInput.click();
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const rows = text.split("\n").map(row => row.split(","));
        data = rows.map(([x, y, label]) => ({ x: +x, y: +y, label: +label }));
        drawScatterPlot();
        alert("Dataset loaded successfully!");
      } catch (error) {
        alert("Failed to load dataset. Ensure it's properly formatted.");
        console.error(error);
      }
    };
  }
  
  function showLoader(show) {
    document.getElementById("loader").classList.toggle("hidden", !show);
  }
  
  // Enhanced Error Handling
  window.onerror = (message, source, lineno, colno, error) => {
    alert("An error occurred. Please check the console for details.");
    console.error("Error Details:", { message, source, lineno, colno, error });
  };

  function visualize3DDecisionBoundary() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(600, 400);
    document.getElementById("decisionBoundary3D").appendChild(renderer.domElement);
  
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
  
    camera.position.z = 5;
  
    function animate() {
      requestAnimationFrame(animate);
      plane.rotation.x += 0.01;
      plane.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  }
a  