document.addEventListener("DOMContentLoaded", function () {
  const messages = [
    "You will use this platform to program your Cuddlebits by dragging and dropping blocks onto the workspace. ",
    "You will be asked to use this interface throughout various activities.<br><br>" +
      "Please remember to name your “sketch” with the <b>activity name, version of your program and other important identifying information.</b><br><br>" +
    "If you’re unsure what to name your file, please ask the experimenter.",
    "To test your blocks and see how the cuddlebits move, please <i>click on the “play” circular button</i> at the top right of the playground.You will be asked to name the file.After naming the file, the Arduino code.ino code will be downloaded. Then, click the.ino file, it will ask you to create a folder with the same name as the.ino file, click “OK”. Once the code is load in the IDE, click the upload button on the IDE, you should see cuddlebits move <br><br>If you experience any issues or the instructions are unclear, please ask the experimenter.",
    "<b>A note about blocks:</b><br><br>All blocks <b>must</b> be in the <i>“multi cuddlebit servo” blue block</i>. <br><br>Green blocks attach to each other and go inside of the black blocks: “DO insert name i can’t remember it.” <br><br>The black blocks attach to black blocks and can be placed inside the sections of the <i>“multi cuddlebit servo” blue block</i>. <br><br>Your experimenter will explain how the interface works once you have completed the First Impression Exploration activity.",
  ];

  let currentMessageIndex = 0;

  const modalElem = document.getElementById("not_running_dialog");
  const messageContainer = document.getElementById("instructionsContainer");
  const prevBtn = document.getElementById("instructionsPrev");
  const nextBtn = document.getElementById("instructionsNext");

  const instance = M.Modal.init(modalElem, {
    onOpenStart: () => updateMessage(),
    onCloseEnd: () => (currentMessageIndex = 0),
  });

  const updateMessage = () => {
    messageContainer.innerHTML = messages[currentMessageIndex];
    prevBtn.disabled = currentMessageIndex === 0;
    nextBtn.disabled = currentMessageIndex === messages.length - 1;
    console.log(nextBtn.disabled);

    if (nextBtn.disabled) {
      nextBtn.classList.add("disabled-button");
    } else {
      nextBtn.classList.remove("disabled-button");
    }

    if (prevBtn.disabled) {
      prevBtn.classList.add("disabled-button");
    } else {
      prevBtn.classList.remove("disabled-button");
    }
  };

  prevBtn.onclick = () => {
    if (currentMessageIndex > 0) {
      currentMessageIndex--;
      updateMessage();
    }
  };

  nextBtn.onclick = () => {
    if (currentMessageIndex < messages.length - 1) {
      currentMessageIndex++;
      updateMessage();
    }
  };

  // Open modal automatically when the page loads
  instance.open();
  console.log("Modal opened automatically.");
});
