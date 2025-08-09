// Configuration and constants for the DOM Tutorial App
const CONFIG = {
  EDITOR_THEME: "monokai",
  DEFAULT_WIDTH: 400,
  DEFAULT_HEIGHT: 300,
  FORCE_SIMULATION: {
    LINK_DISTANCE: {
      ELEMENT: 120,
      DOCUMENT: 120,
      DEFAULT: 80,
    },
    LINK_STRENGTH: 1.0,
    CHARGE_STRENGTH: -500,
    Y_FORCE_STRENGTH: 0.1,
  },
  NODE_RADIUS: {
    DOCUMENT: 22,
    ELEMENT: 18,
    DEFAULT: 14,
  },
};

// Map to store the default code for every editor (customizable per editor)
const defaultEditorCodeMap = new Map([
  [
    "introduction1",
    `<!-- Introduction Example: Basic DOM Manipulation -->
<!DOCTYPE html>
<html>
  <body>
    <h2>My First Page</h2>
    <p id="demo">Original content here</p>
    <script>
      document.getElementById('demo').innerHTML = 'Hello World!';
    </script>
  </body>
</html>`,
  ],
  [
    "methods1",
    `<!-- Methods Example: getElementById & innerHTML -->
<!DOCTYPE html>
<html>
  <body>
    <h2>DOM Methods Example</h2>
    <p id="output">Original content</p>
    <button onclick="changeContent()">Change Content</button>
    <script>
      function changeContent() {
        document.getElementById('output').innerHTML = 'Content changed using DOM methods!';
      }
    </script>
  </body>
</html>`,
  ],
  [
    "document1",
    `<!-- Document Object Example: Find, Change, Add Elements -->
<!DOCTYPE html>
<html>
  <body>
    <h2>Document Object Demo</h2>
    <p id="info">This paragraph will be changed using <code>document</code> methods.</p>
    <button onclick="changeText()">Change Text</button>
    <button onclick="addElement()">Add Element</button>
    <button onclick="changeStyle()">Change Style</button>
    <ul id="myList">
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
    <script>
      // Find and change content
      function changeText() {
        document.getElementById('info').innerHTML = 'Paragraph changed!';
      }
      // Add a new list item
      function addElement() {
        var li = document.createElement('li');
        li.textContent = 'New Item';
        document.getElementById('myList').appendChild(li);
      }
      // Change style
      function changeStyle() {
        document.getElementById('info').style.color = '#e17055';
        document.getElementById('info').style.fontWeight = 'bold';
      }
    </script>
  </body>
</html>`,
  ],
  [
    "elements1",
    `<!-- DOM Elements Example: Finding Elements by ID -->
<!DOCTYPE html>
<html>
  <body>
    <h2>JavaScript HTML DOM</h2>
    <p id="intro">Finding HTML Elements by Id</p>
    <p>This example demonstrates the <b>getElementById</b> method.</p>
    <p id="demo"></p>
    <script>
      const element = document.getElementById("intro");
      document.getElementById("demo").innerHTML = 
        "The text from the intro paragraph is: " + element.innerHTML;
    </script>
  </body>
</html>`,
  ],
  [
    "elements2",
    `<!-- DOM Elements Example: Finding Elements by Tag Name -->
<!DOCTYPE html>
<html>
  <body>
    <h2>JavaScript HTML DOM</h2>
    <p>Finding HTML Elements by Tag Name.</p>
    <p>This example demonstrates the <b>getElementsByTagName</b> method.</p>
    <p id="demo"></p>
    <script>
      const element = document.getElementsByTagName("p");
      document.getElementById("demo").innerHTML = 'The text in first paragraph (index 0) is: ' + element[0].innerHTML;
    </script>
  </body>
</html>`,
  ],
  [
    "elements3",
    `<!-- DOM Elements Example: Finding Elements by Tag Name (within element) -->
<!DOCTYPE html>
<html>
  <body>
    <h2>JavaScript HTML DOM</h2>
    <div id="main">
      <p>Finding HTML Elements by Tag Name</p>
      <p>This example demonstrates the <b>getElementsByTagName</b> method.</p>
    </div>
    <p id="demo"></p>
    <script>
      const x = document.getElementById("main");
      const y = x.getElementsByTagName("p");
      document.getElementById("demo").innerHTML = 
        'The first paragraph (index 0) inside "main" is: ' + y[0].innerHTML;
    </script>
  </body>
</html>`,
  ],
  [
    "elements4",
    `<!-- DOM Elements Example: Finding Elements by Class Name -->
<!DOCTYPE html>
<html>
  <body>
    <h2>JavaScript HTML DOM</h2>
    <p>Finding HTML Elements by Class Name.</p>
    <p class="intro">Hello World!</p>
    <p class="intro">This example demonstrates the <b>getElementsByClassName</b> method.</p>
    <p id="demo"></p>
    <script>
      const x = document.getElementsByClassName("intro");
      document.getElementById("demo").innerHTML = 
        'The first paragraph (index 0) with class="intro" is: ' + x[0].innerHTML;
    </script>
  </body>
</html>`,
  ],
  [
    "changing1",
    `<html>\n<body>\n\n<p id=\"p1\">Hello World!</p>\n\n<script>\ndocument.getElementById(\"p1\").innerHTML = \"New text!\";\n</script>\n\n</body>\n</html>`,
  ],
  [
    "changing2",
    `<!DOCTYPE html>\n<html>\n<body>\n\n<h1 id=\"id01\">Old Heading</h1>\n\n<script>\nconst element = document.getElementById(\"id01\");\nelement.innerHTML = \"New Heading\";\n</script>\n\n</body>\n</html>`,
  ],
  [
    "changing3",
    `<!DOCTYPE html>\n<html>\n<body>\n\n<img id=\"myImage\" src=\"smiley.gif\">\n\n<script>\ndocument.getElementById(\"myImage\").src = \"landscape.jpg\";\n</script>\n\n</body>\n</html>`,
  ],
  [
    "changing4",
    `<!DOCTYPE html>\n<html>\n<body>\n\n<script>\ndocument.getElementById(\"demo\").innerHTML = \"Date : \" + Date();\n</script>\n\n</body>\n</html>`,
  ],
  [
    "changing5",
    `<!DOCTYPE html>\n<html>\n<body>\n\n<p>Bla bla bla</p>\n\n<script>\ndocument.write(Date());\n</script>\n\n<p>Bla bla bla</p>\n\n</body>\n</html>`,
  ],
  [
    "forms1",
    `<!DOCTYPE html>
<html>
<body>
  <h2>JavaScript Form Validation</h2>
  <form name="myForm" onsubmit="return validateForm()" method="post">
    Name: <input type="text" name="fname">
    <input type="submit" value="Submit">
  </form>
  
  <script>
    function validateForm() {
      let x = document.forms["myForm"]["fname"].value;
      if (x == "") {
        alert("Name must be filled out");
        return false;
      }
      alert("Form submitted successfully!");
      return false; // Prevent actual submission for demo
    }
  </script>
</body>
</html>`,
  ],
  [
    "forms2",
    `<!DOCTYPE html>
<html>
<body>
  <h2>Numeric Input Validation</h2>
  <form name="numForm" onsubmit="return validateNumber()" method="post">
    Please input a number between 1 and 10:<br>
    <input type="text" name="numb">
    <input type="submit" value="Submit">
  </form>
  
  <script>
    function validateNumber() {
      let x = document.forms["numForm"]["numb"].value;
      if (isNaN(x) || x < 1 || x > 10) {
        alert("Input is not a number between 1 and 10");
        return false;
      }
      alert("Valid number entered: " + x);
      return false; // Prevent actual submission for demo
    }
  </script>
</body>
</html>`,
  ],
  [
    "forms3",
    `<!DOCTYPE html>
<html>
<body>
  <h2>Automatic HTML Form Validation</h2>
  <form action="#" method="post">
    <input type="text" name="fname" required placeholder="Enter your name">
    <input type="submit" value="Submit">
  </form>
  <p>Try submitting without entering a name!</p>
</body>
</html>`,
  ],
  [
    "forms4",
    `<!DOCTYPE html>
<html>
<head>
  <style>
    input:valid {
      border: 2px solid green;
    }
    input:invalid {
      border: 2px solid red;
    }
    input:required {
      background-color: #ffe6e6;
    }
    .form-group {
      margin: 10px 0;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <h2>Advanced Form Validation with Styling</h2>
  <form id="advancedForm" novalidate>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="age">Age (18-99):</label>
      <input type="number" id="age" name="age" min="18" max="99" required>
    </div>
    <div class="form-group">
      <label for="phone">Phone (format: 123-456-7890):</label>
      <input type="text" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required>
    </div>
    <input type="submit" value="Submit">
  </form>
  
  <script>
    document.getElementById('advancedForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (this.checkValidity()) {
        alert('All fields are valid!');
      } else {
        alert('Please fill in all required fields correctly.');
      }
    });
  </script>
</body>
</html>`,
  ],
  [
    "css1",
    `<html>
<body>

<p id="p2">Hello World!</p>

<script>
document.getElementById("p2").style.color = "blue";
</script>

</body>
</html>`,
  ],
  [
    "css2",
    `<!DOCTYPE html>
<html>
<body>

<h1 id="id1">My Heading 1</h1>

<button type="button"
onclick="document.getElementById('id1').style.color = 'red'">
Click Me!</button>

</body>
</html>`,
  ],
  [
    "css3",
    `<!DOCTYPE html>
<html>
<body>

<h1 id="myElement">This element can be hidden!</h1>

<button type="button" onclick="hideElement()">Hide Element</button>
<button type="button" onclick="showElement()">Show Element</button>

<script>
function hideElement() {
  document.getElementById("myElement").style.display = "none";
}

function showElement() {
  document.getElementById("myElement").style.display = "block";
}
</script>

</body>
</html>`,
  ],
  [
    "css4",
    `<!DOCTYPE html>
<html>
<body>

<h1 id="styleMe">Style me with JavaScript!</h1>

<button type="button" onclick="changeMultipleStyles()">Apply Styles</button>
<button type="button" onclick="resetStyles()">Reset Styles</button>

<script>
function changeMultipleStyles() {
  const element = document.getElementById("styleMe");
  element.style.color = "white";
  element.style.backgroundColor = "purple";
  element.style.fontSize = "24px";
  element.style.padding = "20px";
  element.style.border = "3px solid gold";
  element.style.borderRadius = "10px";
}

function resetStyles() {
  const element = document.getElementById("styleMe");
  element.style.color = "";
  element.style.backgroundColor = "";
  element.style.fontSize = "";
  element.style.padding = "";
  element.style.border = "";
  element.style.borderRadius = "";
}
</script>

</body>
</html>`,
  ],
  [
    "animations1",
    `<!DOCTYPE html>
<html>
<body>

<h1>My First JavaScript Animation</h1>

<div id="animation">My animation will go here</div>

</body>
</html>`,
  ],
  [
    "animations2",
    `<!DOCTYPE html>
<html>
<body>

<h1>Animation Container Example</h1>

<div id="container">
  <div id="animate">My animation will go here</div>
</div>

</body>
</html>`,
  ],
  [
    "animations3",
    `<!DOCTYPE html>
<html>
<head>
<style>
#container {
  width: 400px;
  height: 400px;
  position: relative;
  background: yellow;
}
#animate {
  width: 50px;
  height: 50px;
  position: absolute;
  background: red;
}
</style>
</head>
<body>

<h1>Styled Animation Elements</h1>

<div id="container">
  <div id="animate">Animated Element</div>
</div>

</body>
</html>`,
  ],
  [
    "animations4",
    `<!DOCTYPE html>
<html>
<head>
<style>
#container {
  width: 400px;
  height: 400px;
  position: relative;
  background: yellow;
  border: 1px solid black;
}
#animate {
  width: 50px;
  height: 50px;
  position: absolute;
  background: red;
  border-radius: 50%;
}
</style>
</head>
<body>

<h1>Complete JavaScript Animation</h1>

<button onclick="myMove()">Start Animation</button>

<div id="container">
  <div id="animate"></div>
</div>

<script>
function myMove() {
  let id = null;
  const elem = document.getElementById("animate");
  let pos = 0;
  clearInterval(id);
  id = setInterval(frame, 5);
  function frame() {
    if (pos == 350) {
      clearInterval(id);
    } else {
      pos++;
      elem.style.top = pos + 'px';
      elem.style.left = pos + 'px';
    }
  }
}
</script>

</body>
</html>`,
  ],
  [
    "animations5",
    `<!DOCTYPE html>
<html>
<head>
<style>
#container {
  width: 400px;
  height: 400px;
  position: relative;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  border: 2px solid #333;
  border-radius: 10px;
}
#animate {
  width: 40px;
  height: 40px;
  position: absolute;
  background: red;
  border-radius: 50%;
  transition: all 0.1s;
}
</style>
</head>
<body>

<h1>Advanced Multi-Property Animation</h1>

<button onclick="complexAnimation()">Start Complex Animation</button>
<button onclick="resetAnimation()">Reset</button>

<div id="container">
  <div id="animate"></div>
</div>

<script>
function complexAnimation() {
  let id = null;
  const elem = document.getElementById("animate");
  let pos = 0;
  let size = 40;
  let rotation = 0;
  let hue = 0;
  
  clearInterval(id);
  id = setInterval(frame, 20);
  
  function frame() {
    if (pos >= 300) {
      clearInterval(id);
    } else {
      pos += 2;
      size = 40 + Math.sin(pos * 0.1) * 20;
      rotation += 5;
      hue = (pos * 2) % 360;
      
      elem.style.left = pos + 'px';
      elem.style.top = (200 + Math.sin(pos * 0.05) * 100) + 'px';
      elem.style.width = size + 'px';
      elem.style.height = size + 'px';
      elem.style.transform = 'rotate(' + rotation + 'deg)';
      elem.style.backgroundColor = 'hsl(' + hue + ', 70%, 50%)';
    }
  }
}

  resetAnimation() {
  const elem = document.getElementById("animate");
  elem.style.left = '0px';
  elem.style.top = '0px';
  elem.style.width = '40px';
  elem.style.height = '40px';
  elem.style.transform = 'rotate(0deg)';
  elem.style.backgroundColor = 'red';
}
</script>

</body>
</html>`,
  ],
  [
    "events1",
    `<!DOCTYPE html>
<html>
<body>
    <h1 onclick="this.innerHTML = 'Ooops!'">Click on this text!</h1>
    <p>Try clicking on the heading above. The content will change when you click it!</p>
</body>
</html>`,
  ],
  [
    "events2",
    `<!DOCTYPE html>
<html>
<body>
    <h1 onclick="changeText(this)">Click on this text!</h1>
    <p>This example uses a function to handle the click event.</p>

    <script>
    function changeText(id) {
        id.innerHTML = "Ooops!";
        id.style.color = "red";
        id.style.fontSize = "24px";
    }
    </script>
</body>
</html>`,
  ],
  [
    "events3",
    `<!DOCTYPE html>
<html>
<body>
    <h2>Event Attributes Example</h2>
    <button onclick="displayDate()">What time is it?</button>
    <p id="demo"></p>

    <script>
    function displayDate() {
        const now = new Date();
        document.getElementById("demo").innerHTML = "Current date and time: " + now.toLocaleString();
    }
    </script>
</body>
</html>`,
  ],
  [
    "events4",
    `<!DOCTYPE html>
<html>
<body>
    <h2>Assign Events Using DOM</h2>
    <button id="myBtn">Click me!</button>
    <p id="demo"></p>

    <script>
    document.getElementById("myBtn").onclick = displayMessage;

    function displayMessage() {
        document.getElementById("demo").innerHTML = "Hello! Event was assigned using JavaScript DOM.";
        document.getElementById("myBtn").style.backgroundColor = "#4CAF50";
        document.getElementById("myBtn").style.color = "white";
    }
    </script>
</body>
</html>`,
  ],
  [
    "events5",
    `<!DOCTYPE html>
<html>
<body onload="checkPage()">
    <h2>Page Load Event</h2>
    <p id="welcome"></p>
    <p id="browser-info"></p>

    <script>
    function checkPage() {
        document.getElementById("welcome").innerHTML = "Welcome! The page has loaded successfully.";
        document.getElementById("browser-info").innerHTML = 
            "Browser: " + navigator.userAgent.substring(0, 50) + "...";
    }
    </script>
</body>
</html>`,
  ],
  [
    "events6",
    `<!DOCTYPE html>
<html>
<body>
    <h2>Input Events Example</h2>
    
    <label for="fname">First Name (oninput - converts to uppercase):</label><br>
    <input type="text" id="fname" oninput="upperCase()" placeholder="Type here..."><br><br>
    
    <label for="email">Email (onchange - validates when you finish):</label><br>
    <input type="text" id="email" onchange="validateEmail()" placeholder="Enter your email"><br>
    
    <p id="validation-message"></p>

    <script>
    function upperCase() {
        const x = document.getElementById("fname");
        x.value = x.value.toUpperCase();
    }

    function validateEmail() {
        const email = document.getElementById("email").value;
        const message = document.getElementById("validation-message");
        
        if (email.includes("@") && email.includes(".")) {
            message.innerHTML = "✓ Valid email format!";
            message.style.color = "green";
        } else {
            message.innerHTML = "✗ Please enter a valid email address!";
            message.style.color = "red";
        }
    }
    </script>
</body>
</html>`,
  ],
  [
    "events7",
    `<!DOCTYPE html>
<html>
<head>
    <style>
        #hover-box {
            width: 200px;
            height: 100px;
            background-color: lightblue;
            text-align: center;
            line-height: 100px;
            margin: 20px 0;
            cursor: pointer;
            border: 2px solid #333;
            transition: all 0.3s ease;
        }
        
        #click-box {
            width: 200px;
            height: 100px;
            background-color: lightgreen;
            text-align: center;
            line-height: 100px;
            margin: 20px 0;
            cursor: pointer;
            border: 2px solid #333;
        }
    </style>
</head>
<body>
    <h2>Mouse Events Example</h2>
    
    <div id="hover-box" 
         onmouseover="mouseOver(this)" 
         onmouseout="mouseOut(this)">
        Mouse Over Me!
    </div>
    
    <div id="click-box"
         onmousedown="mouseDown(this)"
         onmouseup="mouseUp(this)"
         onclick="mouseClick(this)">
        Click Me!
    </div>
    
    <p id="event-log">Hover and click the boxes above to see mouse events in action!</p>

    <script>
    function mouseOver(obj) {
        obj.innerHTML = "Thank You";
        obj.style.backgroundColor = "orange";
        obj.style.transform = "scale(1.1)";
        updateLog("Mouse entered the hover box");
    }

    function mouseOut(obj) {
        obj.innerHTML = "Mouse Over Me!";
        obj.style.backgroundColor = "lightblue";
        obj.style.transform = "scale(1)";
        updateLog("Mouse left the hover box");
    }

    function mouseDown(obj) {
        obj.style.backgroundColor = "darkgreen";
        obj.innerHTML = "Mouse Down";
        updateLog("Mouse button pressed down");
    }

    function mouseUp(obj) {
        obj.style.backgroundColor = "lightgreen";
        obj.innerHTML = "Mouse Up";
        updateLog("Mouse button released");
    }

    function mouseClick(obj) {
        obj.innerHTML = "Clicked!";
        updateLog("Complete click event fired");
        setTimeout(() => {
            obj.innerHTML = "Click Me!";
        }, 1000);
    }

    function updateLog(message) {
        document.getElementById("event-log").innerHTML = "Last event: " + message;
    }
    </script>
</body>
</html>`,
  ],
  [
    "listeners1",
    `<!DOCTYPE html>
<html>
<body>
    <h2>Event Listeners Example</h2>
    <button id="myBtn">Click me!</button>
    <p id="demo"></p>

    <script>
    document.getElementById("myBtn").addEventListener("click", displayDate);

    function displayDate() {
        document.getElementById("demo").innerHTML = "Current date and time: " + new Date().toLocaleString();
    }
    </script>
</body>
</html>`,
  ],
  [
    "listeners2",
    `<!DOCTYPE html>
<html>
<body>
    <h2>Anonymous vs Named Functions</h2>
    <button id="btn1">Anonymous Function</button>
    <button id="btn2">Named Function</button>
    <p id="result"></p>

    <script>
    // Anonymous function
    document.getElementById("btn1").addEventListener("click", function() {
        document.getElementById("result").innerHTML = "Anonymous function called!";
        document.getElementById("result").style.color = "blue";
    });

    // Named function
    document.getElementById("btn2").addEventListener("click", myNamedFunction);

    function myNamedFunction() {
        document.getElementById("result").innerHTML = "Named function called!";
        document.getElementById("result").style.color = "green";
    }
    </script>
</body>
</html>`,
  ],
  [
    "listeners3",
    `<!DOCTYPE html>
<html>
<body>
    <h2>Multiple Event Handlers</h2>
    <button id="multiBtn">Multi-Handler Button</button>
    <div id="output"></div>

    <script>
    const button = document.getElementById("multiBtn");
    const output = document.getElementById("output");

    // Multiple click handlers
    button.addEventListener("click", function() {
        output.innerHTML += "<p>First click handler executed</p>";
    });

    button.addEventListener("click", function() {
        output.innerHTML += "<p>Second click handler executed</p>";
    });

    // Different event types
    button.addEventListener("mouseover", function() {
        this.style.backgroundColor = "lightblue";
        output.innerHTML += "<p>Mouse over event</p>";
    });

    button.addEventListener("mouseout", function() {
        this.style.backgroundColor = "";
        output.innerHTML += "<p>Mouse out event</p>";
    });

    // Clear output
    button.addEventListener("dblclick", function() {
        output.innerHTML = "<p>Output cleared by double-click</p>";
    });
    </script>
</body>
</html>`,
  ],
  [
    "listeners4",
    `<!DOCTYPE html>
<html>
<body>
    <h2>Window Event Listeners</h2>
    <p id="windowInfo">Window information will appear here</p>
    <p id="resizeInfo">Resize the window to see events</p>
    <button id="loadBtn">Trigger Load Event</button>

    <script>
    // Window resize event
    window.addEventListener("resize", function() {
        document.getElementById("resizeInfo").innerHTML = 
            "Window resized to: " + window.innerWidth + "x" + window.innerHeight + " at " + new Date().toLocaleTimeString();
    });

    // Window load event (simulated)
    document.getElementById("loadBtn").addEventListener("click", function() {
        document.getElementById("windowInfo").innerHTML = 
            "Page dimensions: " + window.innerWidth + "x" + window.innerHeight + 
            "<br>User Agent: " + navigator.userAgent.substring(0, 50) + "...";
    });

    // Document click event
    document.addEventListener("click", function(event) {
        if (event.target.tagName !== "BUTTON") {
            document.getElementById("windowInfo").innerHTML = 
                "Document clicked at: " + event.clientX + ", " + event.clientY;
        }
    });
    </script>
</body>
</html>`,
  ],
  [
    "listeners5",
    `<!DOCTYPE html>
<html>
<head>
    <style>
        #outer {
            width: 300px;
            height: 200px;
            background-color: lightblue;
            padding: 20px;
            border: 2px solid blue;
        }
        #inner {
            width: 150px;
            height: 100px;
            background-color: lightcoral;
            margin: 20px;
            border: 2px solid red;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h2>Event Bubbling vs Capturing</h2>
    <div id="outer">
        Outer Div (Blue)
        <div id="inner">Inner Div (Click Me!)</div>
    </div>
    <button onclick="togglePropagation()">Toggle: <span id="mode">Bubbling</span></button>
    <p id="eventLog">Click the inner div to see event propagation</p>

    <script>
    let isCapturing = false;

    function setupEventListeners() {
        // Remove existing listeners first
        const outer = document.getElementById("outer");
        const inner = document.getElementById("inner");
        
        // Clear existing listeners by cloning elements
        const newOuter = outer.cloneNode(true);
        const newInner = newOuter.querySelector("#inner");
        outer.parentNode.replaceChild(newOuter, outer);

        // Add new listeners with current capturing setting
        newOuter.addEventListener("click", function() {
            updateLog("Outer div clicked");
        }, isCapturing);

        newInner.addEventListener("click", function() {
            updateLog("Inner div clicked");
        }, isCapturing);
    }

    function updateLog(message) {
        const log = document.getElementById("eventLog");
        log.innerHTML += "<br>" + message + " (" + (isCapturing ? "capturing" : "bubbling") + ")";
    }

    function togglePropagation() {
        isCapturing = !isCapturing;
        document.getElementById("mode").textContent = isCapturing ? "Capturing" : "Bubbling";
        document.getElementById("eventLog").innerHTML = "Mode changed to " + (isCapturing ? "capturing" : "bubbling") + ". Click the inner div to see the difference.";
        setupEventListeners();
    }

    // Initial setup
    setupEventListeners();
    </script>
</body>
</html>`,
  ],
  [
    "listeners6",
    `<!DOCTYPE html>
<html>
<head>
    <style>
        #trackingArea {
            width: 400px;
            height: 200px;
            background-color: #f0f0f0;
            border: 2px solid #333;
            margin: 20px 0;
            padding: 20px;
            position: relative;
        }
    </style>
</head>
<body>
    <h2>Adding and Removing Event Listeners</h2>
    <button id="startBtn">Start Mouse Tracking</button>
    <button id="stopBtn">Stop Mouse Tracking</button>
    <div id="trackingArea">Move your mouse here when tracking is enabled</div>
    <p id="mouseInfo">Mouse tracking: <span id="status">Stopped</span></p>
    <p id="coordinates">Coordinates will appear here</p>

    <script>
    const trackingArea = document.getElementById("trackingArea");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const status = document.getElementById("status");
    const coordinates = document.getElementById("coordinates");

    function trackMouse(event) {
        const rect = trackingArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        coordinates.innerHTML = \`Mouse position: X=\${Math.round(x)}, Y=\${Math.round(y)}\`;
    }

    function startTracking() {
        trackingArea.addEventListener("mousemove", trackMouse);
        status.textContent = "Active";
        status.style.color = "green";
        trackingArea.style.backgroundColor = "#e8f5e8";
        coordinates.innerHTML = "Mouse tracking started - move mouse over the area";
    }

    function stopTracking() {
        trackingArea.removeEventListener("mousemove", trackMouse);
        status.textContent = "Stopped";
        status.style.color = "red";
        trackingArea.style.backgroundColor = "#f0f0f0";
        coordinates.innerHTML = "Mouse tracking stopped";
    }

    startBtn.addEventListener("click", startTracking);
    stopBtn.addEventListener("click", stopTracking);
    </script>
</body>
</html>`,
  ],
  [
    "listeners7",
    `<!DOCTYPE html>
<html>
<body>
    <h2>Passing Parameters to Event Handlers</h2>
    <button id="redBtn">Make Red</button>
    <button id="blueBtn">Make Blue</button>
    <button id="greenBtn">Make Green</button>
    <button id="customBtn">Custom Message</button>
    
    <div id="colorBox" style="width: 200px; height: 100px; border: 2px solid #333; margin: 20px 0; background-color: white; display: flex; align-items: center; justify-content: center;">
        Color Box
    </div>
    
    <p id="message">Click buttons to see parameter passing in action</p>

    <script>
    const colorBox = document.getElementById("colorBox");
    const message = document.getElementById("message");

    // Function that accepts parameters
    function changeColor(color, text) {
        colorBox.style.backgroundColor = color;
        colorBox.textContent = text;
        message.innerHTML = \`Color changed to \${color} with text: "\${text}"\`;
    }

    function showMessage(msg, sender) {
        message.innerHTML = \`Message from \${sender}: \${msg}\`;
        message.style.fontWeight = "bold";
        setTimeout(() => {
            message.style.fontWeight = "normal";
        }, 2000);
    }

    // Using anonymous functions to pass parameters
    document.getElementById("redBtn").addEventListener("click", function() {
        changeColor("lightcoral", "Red Box");
    });

    document.getElementById("blueBtn").addEventListener("click", function() {
        changeColor("lightblue", "Blue Box");
    });

    document.getElementById("greenBtn").addEventListener("click", function() {
        changeColor("lightgreen", "Green Box");
    });

    document.getElementById("customBtn").addEventListener("click", function() {
        showMessage("Hello from event listener!", "Custom Button");
    });

    // Reset functionality
    colorBox.addEventListener("dblclick", function() {
        changeColor("white", "Color Box");
        message.innerHTML = "Box reset by double-click";
    });
    </script>
</body>
</html>`,
  ],
]);

// Export the configuration and map for ES6 module usage
export { CONFIG, defaultEditorCodeMap };
