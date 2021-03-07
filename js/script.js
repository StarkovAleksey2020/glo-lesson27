// функция возвращает принятые через rest-оператор параметры, отфильтрованные по типу, также принятому в параметрах функции
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

	// создание функции - скрывает все элементы div с классом dialog__response-block
	hideAllResponseBlocks = () => {
		// формирует массив из псевдомассива с найденными div-элементами с классом dialog__response-block
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// устанавливает свойство display в значение none для кадлого элемента массива responseBlocksArray - скрывает элементы
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},

	// создание функции - принимает параметры: селектор элементов для перевода в display: block, техт сообщения для передачи в span-селектор
	// и селектор для приема сообщения
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		// вызывается функция, скрывающая селекторы с ответами
		hideAllResponseBlocks();
		// показываются селекторы (display: block) в соответствии с первым полученным параметром
		document.querySelector(blockSelector).style.display = 'block';
		// если имеется третий параметр (селектор для приема сообщения) - передаем в него текст (второй параметр)
		if (spanSelector) {
			// присвоение текста (второй параметр) в селектор (третий параметр)
			document.querySelector(spanSelector).textContent = msgText;
		}
	},

	// занесение в константу функции, передающей сообщение об ошибке (в тэг с id #error) в селектор с классом dialog__response-block_error
	// msgText принимает значение для передачи в селектор
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	// занесение в константу функции, передающей сообщение ОК (в тэг с id #ок) в селектор с классом dialog__response-block_ок
	// msgText принимает значение для передачи в селектор
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	// занесение в константу функции, активирующей тэг с классом dialog__response-block_no-results
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	// объявление функции, фильтрующей принимаемые в параметрах значения по принимаемому там же типу
	tryFilterByType = (type, values) => {
		// открывается блок try
		try {
			// формируется массив из отфильтрованных по типу принятых значений. Вызывается ранее объявленная функция filterByType
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			// формируется строка сообщения с результатом фильтрации параметров: при отличной от нуля длине массива выводится сообщение
			// с искомым типом и результирующим массивом; при отсутствии искомого типа данных - сообщение об отсутствии даныых соответствующего
			// типа
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
			// вызывается функция showResults, далее передается сообщение для вывода через showResponseBlock результата фильтрации данных
			showResults(alertMsg);
			// отлавливание ошибок
		} catch (e) {
			// вызывается функция showError с передачей стека ошибок с последующей отрисовкой через showResponseBlock
			showError(`Ошибка: ${e}`);
		}
	};

// находим кнопку, запускающую фильтрацию по введенным данным
const filterButton = document.querySelector('#filter-btn');

// добавляем слушатель клика по найденной кнопке
filterButton.addEventListener('click', e => {
	// находим селектор для выбора типа данных
	const typeInput = document.querySelector('#type');
	// находим строку ввода с данными
	const dataInput = document.querySelector('#data');

	// вариант с незаполненной строкой данных
	if (dataInput.value === '') {
		// строка подсказки получает напоминание о неоходимости заполнения
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		// вызывается функция, скрывающая сообщения с результатом и ошибкой. Пока показываеть нечего
		showNoResults();
		// строка данных заполнена
	} else {
		// подсказка при вводе данных удаляется
		dataInput.setCustomValidity('');
		// отмена действия по умолчанию
		e.preventDefault();
		// вызов функции фильтрации и анализа введенных данных и выбранного типа данных
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});

