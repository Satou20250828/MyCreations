let words = [];

function renderWords() {
  const wordList = document.getElementById("wordList");
  wordList.innerHTML = "";

  words.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "word-item";

    const text = document.createElement("span");
    text.textContent = `${item.word} : ${item.meaning}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.className = "edit";
    editBtn.onclick = () => editWord(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.className = "delete";
    deleteBtn.onclick = () => deleteWord(index);

    div.appendChild(text);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);

    wordList.appendChild(div);
  });
}

function addWord() {
  const wordInput = document.getElementById("wordInput");
  const meaningInput = document.getElementById("meaningInput");

  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();

  if (word && meaning) {
    words.push({ word, meaning });
    wordInput.value = "";
    meaningInput.value = "";
    renderWords();
  }
}

function editWord(index) {
  const newWord = prompt("新しい単語を入力してください", words[index].word);
  const newMeaning = prompt("新しい意味を入力してください", words[index].meaning);

  if (newWord && newMeaning) {
    words[index] = { word: newWord, meaning: newMeaning };
    renderWords();
  }
}

function deleteWord(index) {
  if (confirm("削除しますか？")) {
    words.splice(index, 1);
    renderWords();
  }
}
