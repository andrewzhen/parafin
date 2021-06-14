import { useState, useEffect } from 'react';
import './assets/css/index.scss';

export default function Slider() {
  const MIN_AMOUNT = 10000;
  const MAX_AMOUNT = 30000;
  const STEP_AMOUNT = 2000;
  const DEFAULT_AMOUNT = 26000;
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [nearestTwoThousand, setNearestTwoThousand] = useState(DEFAULT_AMOUNT);
  const [error, setError] = useState(false);

  
  const createSliderMarks = exceeded => {
    let marks = [];
    for (let i = MIN_AMOUNT; i <= MAX_AMOUNT; i+=STEP_AMOUNT) {
      marks.push(
        <div 
          key={i} 
          className={'marks ' + (exceeded ? 'exceeded' : 'excess')}
        ></div>
      );
    }
    return marks;
  }

  const exceededSliderMarks = createSliderMarks(true);
  const excessSliderMarks = createSliderMarks(false);

  const setCSSProperty = () => {
    let slider = document.querySelector('[type="range"]'); 
    let percent =
      ((slider.value - slider.min) /
      (slider.max - slider.min)) * 100;
    slider.style.setProperty("--webkitProgressPercent", `${percent}%`);
  }
    
  const format = val => {
    return new Intl.NumberFormat().format(val);
  }

  const getNumCommas = val => {
    if (val < 1000) {
      return 0;
    } else {
      return 1 + getNumCommas(val / 1000);
    }
  }

  const getAmountSpacing = val => {
    let digits = Number(val).toString().length;
    let commas = getNumCommas(val);

    return [digits || 1, commas || 1];
  }

  const adjustDollarPosition = val => {
    let [digits, commas] = getAmountSpacing(val);
    document.getElementById('dollar').style.setProperty(
      'left', 
      `calc(50% - 1rem - ${digits * 0.75}ch - ${commas * 0.35}ch)`
    );
  }

  const handleAmount = (id, val, formatVal) => {
    document.getElementById(id).value = formatVal ? format(val) : val;
    setAmount(val);
    setError(val < MIN_AMOUNT || val > MAX_AMOUNT);
    adjustDollarPosition(val);
    setCSSProperty();
  }

  const handleCustomInput = e => {
    let re = /^[0-9\b]+$/;
    let val = e.target.value.replaceAll(',', '');

    // if value is not blank, then test the regex
    if (val === '' || re.test(val)) {
      handleAmount('slider', val, false);
    }
  }

  const handleRangeInput = () => {
    let val = document.getElementById('slider').value;

    let nearestTwoThousand = 
      MIN_AMOUNT + Math.round((val - MIN_AMOUNT) / STEP_AMOUNT) * STEP_AMOUNT;
    let newVal = 
      val >= nearestTwoThousand ? 
      nearestTwoThousand : nearestTwoThousand - STEP_AMOUNT;
    
    setNearestTwoThousand(nearestTwoThousand);
    handleAmount('amount', newVal, true);
  }

  const snapRange = () => {
    setTimeout(() => {
      document.getElementById('slider').value = nearestTwoThousand;
      handleAmount('amount', nearestTwoThousand, true);
    }, 0);
  }

  useEffect(() => {
    setCSSProperty();
  }, []);

  return (
    <div className='container'>
      <div className={'amount-container ' + (error ? 'error' : null)}>
        <span id='dollar'>$</span>
        <input 
          id='amount'
          type='text'
          value={format(amount)}
          onChange={e => handleCustomInput(e)}
        />
      </div>

      <p id='error-message' className={error ? 'display' : null}>
        Please enter an amount between 
        ${format(MIN_AMOUNT)} and ${format(MAX_AMOUNT)}
      </p>

      <div className='slider-container'>
        <div className='slider-track-container'>
          <div className='slider-marks-container'>
            {excessSliderMarks}
          </div>
        </div>

        <input 
          id='slider'
          type='range'
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          defaultValue={amount}
          onChange={handleRangeInput}
          onMouseUp={snapRange}
        />
        
        <div className='slider-marks-container'>
          {exceededSliderMarks}
        </div>
      </div>

      <div className='label-container'>
        <p>{`$${format(MIN_AMOUNT)}`}</p>
        <p>{`$${format(MAX_AMOUNT)}`}</p>
      </div>
    </div>
  );
}