(() => {
  const output = document.getElementById('output');
  const history = document.getElementById('history');
  const keys = document.querySelectorAll('.key');

  let expression = '';

  function updateDisplay(){
    output.value = expression || '0';
  }

  function safeEval(expr){
    if(!/^[0-9+\-*/().%\s]+$/.test(expr)){
      throw new Error('不正な入力');
    }
    const replaced = expr.replace(/%/g, '/100');
    if(/[+\-*/]{2,}/.test(replaced.replace(/\s+/g,''))){
      throw new Error('演算子が連続しています');
    }
    if(/[+\-*/.]$/.test(replaced.trim())){
      throw new Error('式が不完全です');
    }
    const result = Function('return (' + replaced + ')')();
    if(!isFinite(result)) throw new Error('計算できません');
    return result;
  }

  function onInput(token){
    if(token === 'C'){
      expression = '';
      history.textContent = '';
      updateDisplay();
      return;
    }
    if(token === 'BACK'){
      expression = expression.slice(0, -1);
      updateDisplay();
      return;
    }
    if(token === '='){
      try{
        const res = safeEval(expression);
        history.textContent = expression + ' =';
        expression = String(res);
        updateDisplay();
      }catch(e){
        output.value = 'エラー';
        setTimeout(updateDisplay, 800);
      }
      return;
    }
    expression += token;
    updateDisplay();
  }

  keys.forEach(k => {
    k.addEventListener('click', () => {
      const action = k.dataset.action;
      const value = k.dataset.value;
      if(action === 'clear') onInput('C');
      else if(action === 'back') onInput('BACK');
      else if(action === 'equals') onInput('=');
      else if(value) onInput(value);
    });
  });

  window.addEventListener('keydown', (e) => {
    if(e.key >= '0' && e.key <= '9'){
      onInput(e.key);
      e.preventDefault();
      return;
    }
    if(['+','-','*','/','(',')','.','%'].includes(e.key)){
      onInput(e.key);
      e.preventDefault();
      return;
    }
    if(e.key === 'Enter'){
      onInput('=');
      e.preventDefault();
      return;
    }
    if(e.key === 'Backspace'){
      onInput('BACK');
      e.preventDefault();
      return;
    }
    if(e.key === 'Escape'){
      onInput('C');
      e.preventDefault();
      return;
    }
  });

  updateDisplay();
})();
