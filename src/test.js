
describe("Проверка автокомлита и подсказок редактора кода", function () {

  require(['editor'], function () {

    var assert = chai.assert;
    var expect = chai.expect;
    chai.should();

    function getPosition(model) {

      let strings = model.getValue().split('\n');
      return new monaco.Position(strings.length, strings[strings.length - 1].length + 1);

    }

    function getModel(string) {

      return monaco.editor.createModel(string, 'bsl');

    }

    function helper(string) {
      let model = getModel(string);
      let position = getPosition(model);
      return new bslHelper(model, position);
    }

    function helperToConsole(helper) {
      
      console.log('line number:', helper.column);
      console.log('column:', helper.lineNumber);      
      console.log('word:', helper.word);
      console.log('last operator:', helper.lastOperator);
      console.log('whitespace:', helper.hasWhitespace);
      console.log('last expr:', helper.lastExpression);
      console.log('expr array:', helper.getExpressioArray());      
      console.log('last raw expr:', helper.lastRawExpression);
      console.log('raw array:', helper.getRawExpressioArray());      
      console.log('text before:', helper.textBeforePosition);
            
    }

    let bsl = helper('');
    let bslLoaded = (bslGlobals != undefined);

    it("проверка загрузки bslGlobals", function () {
      assert.equal(bslLoaded, true);
    });

    if (bslLoaded) {

      it("проверка существования глобальной переменной editor", function () {
        assert.notEqual(editor, undefined);
      });

      it("проверка определения русского языка", function () {
        assert.equal(bsl.hasRu('тест'), true);
      });
   
      it("проверка автокомплита для глобальной функции Найти", function () {
        bsl = helper('най');
        let suggestions = [];
        bsl.getCommonCompletition(suggestions, bslGlobals.globalfunctions, monaco.languages.CompletionItemKind.Function)
        expect(suggestions).to.be.an('array').that.not.is.empty;
      });

      it("проверка автокомплита для глобальной функции Найти обернутой в функцию", function () {
        bsl = helper('СтрНайти(Най');
        let suggestions = [];
        bsl.getCommonCompletition(suggestions, bslGlobals.globalfunctions, monaco.languages.CompletionItemKind.Function)
        expect(suggestions).to.be.an('array').that.not.is.empty;
      });

      it("проверка подсказки параметров для глобальной функции Найти(", function () {
        bsl = helper('Найти(');        
        let suggestions = [];
        let help = bsl.getCommonSigHelp(bslGlobals.globalfunctions);
        expect(help).to.have.property('activeParameter');
      });

      it("проверка подсказки параметров для глобальной функции Найти обернутой в функцию", function () {
        bsl = helper('СтрНайти(Найти(');
        let suggestions = [];
        let help = bsl.getCommonSigHelp(bslGlobals.globalfunctions);
        expect(help).to.have.property('activeParameter');
      });

      it("проверка автокомплита для конструктора HTTPЗапрос", function () {
        bsl = helper('Запрос = Новый HTTPЗа');
        assert.equal(bsl.requireClass(), true);
        let suggestions = [];
        bsl.getCommonCompletition(suggestions, bslGlobals.classes, monaco.languages.CompletionItemKind.Constructor)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        expect(suggestions).to.have.deep.property('[0].label', 'HTTPЗапрос');
      });

      it("проверка автокомплита для конструктора HTTPЗапрос обернутого в функцию", function () {
        bsl = helper('СтрНайти(Новый HTTPЗа');
        assert.equal(bsl.requireClass(), true);
        let suggestions = [];
        bsl.getCommonCompletition(suggestions, bslGlobals.classes, monaco.languages.CompletionItemKind.Constructor)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        expect(suggestions).to.have.deep.property('[0].label', 'HTTPЗапрос');
      });

      it("проверка подсказки параметров для конструктора HTTPЗапрос", function () {
        bsl = helper('Новый HTTPЗапрос(');
        let suggestions = [];
        let help = bsl.getClassSigHelp(bslGlobals.classes);
        expect(help).to.have.property('activeParameter');
      });

      it("проверка подсказки параметров для конструктора HTTPЗапрос обернутого в функцию", function () {
        bsl = helper('СтрНайти(Новый HTTPЗапрос(');
        let suggestions = [];
        let help = bsl.getClassSigHelp(bslGlobals.classes);
        expect(help).to.have.property('activeParameter');
      });

      it("проверка автокомплита объекта HTTPЗапрос (список свойств и методов)", function () {
        bsl = helper('HTTPЗапрос.');
        let suggestions = [];
        bsl.getClassCompletition(suggestions, bslGlobals.classes);
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "УстановитьПараметр"), false);
      });

      it("проверка автокомплита для экземпляра объекта HTTPЗапрос (список свойств и методов)", function () {
        bsl = helper('Запрос = Новый HTTPЗапрос();\nЗапрос.');
        let suggestions = [];
        bsl.getClassCompletition(suggestions, bslGlobals.classes);
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "УстановитьПараметр"), false);
      });      

      it("проверка автокомплита объекта HTTPЗапрос (список свойств и методов) обернутого в функцию", function () {
        bsl = helper('Найти(HTTPЗапрос.');
        let suggestions = [];
        bsl.getClassCompletition(suggestions, bslGlobals.classes);
        expect(suggestions).to.be.an('array').that.not.is.empty;
      });

      it("проверка автокомплита метода УстановитьИмяФайлаТела объекта HTTPЗапрос", function () {
        bsl = helper('HTTPЗапрос.УстановитьИмя');
        let suggestions = [];
        bsl.getClassCompletition(suggestions, bslGlobals.classes);
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "УстановитьИмяФайлаТела"), true);
      });

      it("проверка автокомплита метода УстановитьИмяФайлаТела объекта HTTPЗапрос обернутого в функцию", function () {
        bsl = helper('Найти(HTTPЗапрос.УстановитьИмя');
        let suggestions = [];
        bsl.getClassCompletition(suggestions, bslGlobals.classes);
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "УстановитьИмяФайлаТела"), true);
      });

      it("проверка автокомплита для объекта метаданных 'Справочники'", function () {
        bsl = helper('Товар = Справоч');
        let suggestions = [];
        bsl.getCommonCompletition(suggestions, bslGlobals.globalvariables, monaco.languages.CompletionItemKind.Class)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        expect(suggestions).to.have.deep.property('[0].label', 'Справочники');
      });

      it("проверка автокомплита для объекта метаданных 'Справочники.' обернутого в функцию", function () {
        bsl = helper('Найти(Справочн');
        let suggestions = [];
        bsl.getCommonCompletition(suggestions, bslGlobals.globalvariables, monaco.languages.CompletionItemKind.Class)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        expect(suggestions).to.have.deep.property('[0].label', 'Справочники');
      });

      it("проверка автокомплита для объекта метаданных 'Справочники.' (список справочников)", function () {
        bsl = helper('Товар = Справочники.');
        let suggestions = [];
        bsl.getMetadataCompletition(suggestions, bslMetadata)
        expect(suggestions).to.be.an('array').that.not.is.empty;
      });

      it("проверка автокомплита для объекта метаданных 'Справочники.' (список справочников) обернутого в функцию", function () {
        bsl = helper('Найти(Справочники.');
        let suggestions = [];
        bsl.getMetadataCompletition(suggestions, bslMetadata)
        expect(suggestions).to.be.an('array').that.not.is.empty;
      });

      it("проверка автокомплита для объекта метаданных 'Справочники.Товары.' (список функций менеджера)", function () {
        bsl = helper('Товар = Справочники.Товары.');
        let suggestions = [];
        bsl.getMetadataCompletition(suggestions, bslMetadata)
        expect(suggestions).to.be.an('array').that.not.is.empty;
      });

      it("проверка автокомплита для объекта метаданных 'Справочники.Товары.' (список функций менеджера) обернутого в функцию", function () {
        bsl = helper('Найти(Справочники.Товары.');
        let suggestions = [];
        bsl.getMetadataCompletition(suggestions, bslMetadata)
        expect(suggestions).to.be.an('array').that.not.is.empty;
      });

      it("проверка автокомплита для элемента справочника 'Товары.' (список реквизитов и функций объекта)", function () {
        bsl = helper('Товар = Справочники.Товары.НайтиПоКоду(1);\nТовар.');
        let suggestions = [];
        bsl.getMetadataCompletition(suggestions, bslMetadata)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "Цена"), true);
      });

      it("проверка автокомплита для элемента справочника 'Товары.' (список предопределенных)", function () {
        bsl = helper('Товар = Справочники.Товары.');
        let suggestions = [];
        bsl.getMetadataCompletition(suggestions, bslMetadata)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "Услуга"), true);
      });

      it("проверка автокомплита для элемента справочника 'Товары.' (список реквизитов и функций объекта) обернутого в функцию", function () {
        bsl = helper('Товар = Справочники.Товары.НайтиПоКоду(1);\nНайти(Товар.');
        let suggestions = [];
        bsl.getMetadataCompletition(suggestions, bslMetadata)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "Цена"), true);
      });

      it("проверка подсказки параметров для метода 'Записать' документа 'АвансовыйОтчет'", function () {
        bsl = helper('Док = Документы.АвансовыйОтчет.НайтиПоНомеру(1);\nДок.Записать(');
        let suggestions = [];
        let help = bsl.getMetadataSigHelp(bslMetadata);
        expect(help).to.have.property('activeParameter');
      });

      it("проверка получения существующего текста запроса", function () {        
      	editor.setPosition(new monaco.Position(10, 1));
        assert.notEqual(getQuery(), null);
      });

      it("проверка получения несуществующего текста запроса", function () {        
      	editor.setPosition(new monaco.Position(1, 1));
        assert.equal(getQuery(), null);
      });

      it("проверка очистки всего текста", function () {              	
        let text = editor.getValue();
        eraseText();
        assert.equal(editor.getValue(), getText());
        editor.setValue(text);
        assert.equal(text, getText());
      });

      it("проверка обновления метаданных", function () {              	                
        let mCopy = JSON.parse(JSON.stringify(bslMetadata));        
        assert.notEqual(updateMetadata(123), true);
        let strJSON = '{"catalogs": {"АвансовыйОтчетПрисоединенныеФайлы": {"properties": {"Автор": "Автор","ВладелецФайла": "Размещение","ДатаМодификацииУниверсальная": "Дата изменения (универсальное время)","ДатаСоздания": "Дата создания","Зашифрован": "Зашифрован","Изменил": "Отредактировал","ИндексКартинки": "Индекс значка","Описание": "Описание","ПодписанЭП": "Подписан электронно","ПутьКФайлу": "Путь к файлу","Размер": "Размер (байт)","Расширение": "Расширение","Редактирует": "Редактирует","СтатусИзвлеченияТекста": "Статус извлечения текста","ТекстХранилище": "Текст","ТипХраненияФайла": "Тип хранения файла","Том": "Том","ФайлХранилище": "Временное хранилище файла","ДатаЗаема": "Дата заема","ХранитьВерсии": "Хранить версии","ИмяПредопределенныхДанных": "","Предопределенный": "","Ссылка": "","ПометкаУдаления": "","Наименование": ""}}}}';                
        assert.equal(updateMetadata(strJSON), true);
        bsl = helper('Отчет = Справочники.АвансовыйОтчетПрисоединенныеФайлы.НайтиПоКоду(1);\nОтчет.');
        let suggestions = [];
        bsl.getMetadataCompletition(suggestions, bslMetadata)        
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "ДатаМодификацииУниверсальная"), true);
        bslMetadata = JSON.parse(JSON.stringify(mCopy));
      });

      it("проверка обновления сниппетов", function () {              	                
        let sCopy = JSON.parse(JSON.stringify(snippets));        
        assert.notEqual(updateSnippets(123), true);
        let strJSON = '{"snippets": { "ЕслиЧто": { "prefix": "Если", "body": "Если ${1:Условие} Тогда\n\t$0\nКонецЕсли;", "description": "ЕслиЧто"}}}';
        assert.equal(updateSnippets(strJSON), true);
        bsl = helper('ЕслиЧто');
        let suggestions = [];
        bsl.getSnippets(suggestions, snippets);        
        expect(suggestions).to.be.an('array').that.not.is.empty;        
        assert.equal(suggestions.some(suggest => suggest.detail === "ЕслиЧто"), true);
        snippets = JSON.parse(JSON.stringify(sCopy));
      });

      it("проверка замены сниппетов", function () {              	                
        let sCopy = JSON.parse(JSON.stringify(snippets));                
        let strJSON = '{"snippets": { "ЕслиЧто": { "prefix": "Если", "body": "Если ${1:Условие} Тогда\n\t$0\nКонецЕсли;", "description": "ЕслиЧто"}}}';
        assert.equal(updateSnippets(strJSON, true), true);
        bsl = helper('Если');
        let suggestions = [];
        bsl.getSnippets(suggestions, snippets);
        assert.equal(suggestions.length, 1);
        snippets = JSON.parse(JSON.stringify(sCopy));
      });

      it("проверка всплывающей подсказки", function () {        
        let model = getModel("Найти(");
        let position = new monaco.Position(1, 2);
        bsl = new bslHelper(model, position);
        assert.notEqual(bsl.getHover(), null);
        model = getModel("НайтиЧтоНибудь(");
        bsl = new bslHelper(model, position);
        assert.equal(bsl.getHover(), null);        
      });

      it("проверка получения существующей форматной строки", function () {        
      	editor.setPosition(new monaco.Position(47, 33));
        assert.notEqual(getFormatString(), null);
      });

      it("проверка получения несуществующей форматной строки", function () {        
        editor.setPosition(new monaco.Position(47, 21));
        assert.equal(getFormatString(), null);
        editor.setPosition(new monaco.Position(10, 1));
        assert.equal(getFormatString(), null);
      });

      it("проверка загрузки пользовательских функций", function () {
        let strJSON = '{ "customFunctions":{ "МояФункция1":{ "name":"МояФункция1", "name_en":"MyFuntion1", "description":"Получает из строки закодированной по алгоритму base64 двоичные данные.", "returns":"Тип: ДвоичныеДанные. ", "signature":{ "default":{ "СтрокаПараметров":"(Строка: Строка): ДвоичныеДанные", "Параметры":{ "Строка":"Строка, закодированная по алгоритму base64." } } } }, "МояФункция2":{ "name":"МояФункция2", "name_en":"MyFuntion2", "description":"Выполняет сериализацию значения в формат XML.", "template":"МояФункция2(ВызовЗависимойФункции(${1:ПервыйЗависимыйПараметр}, ${2:ВторойЗависимыйПараметр}), ${0:ПараметрМоейФункции}))", "signature":{ "ЗаписатьБезИмени":{ "СтрокаПараметров":"(ЗаписьXML: ЗаписьXML, Значение: Произвольный, НазначениеТипа?: НазначениеТипаXML)", "Параметры":{ "ЗаписьXML":"Объект, через который осуществляется запись XML, полученный через зависимою функцию", "Значение":"Записываемое в поток XML значение. Тип параметра определяется совокупностью типов, для которых определена XML-сериализация." } }, "ЗаписатьСПолнымИменем":{ "СтрокаПараметров":"(ЗаписьXML: ЗаписьXML, Значение: Произвольный, ПолноеИмя: Строка, НазначениеТипа?: НазначениеТипаXML)", "Параметры":{ "ЗаписьXML":"Объект, через который осуществляется запись XML.", "Значение":"Записываемое в поток XML значение. Тип параметра определяется совокупностью типов, для которых определена XML-сериализация.", "ПолноеИмя":"Полное имя элемента XML, в который будет записано значение.", "НазначениеТипа":"Определяет необходимость назначения типа элементу XML. Значение по умолчанию: Неявное." } }, "ЗаписатьСЛокальнымИменемИПространствомИмен":{ "СтрокаПараметров":"(ЗаписьXML: ЗаписьXML, Значение: Произвольный, ЛокальноеИмя: Строка, URIПространстваИмен: Строка, НазначениеТипа?: НазначениеТипаXML)", "Параметры":{ "ЗаписьXML":"Объект, через который осуществляется запись XML.", "Значение":"Записываемое в поток XML значение. Тип параметра определяется совокупностью типов, для которых определена XML-сериализация.", "ЛокальноеИмя":"Локальное имя элемента XML, в который будет записано значение.", "URIПространстваИмен":"URI пространства имен, к которому принадлежит указанное ЛокальноеИмя.", "НазначениеТипа":"Определяет необходимость назначения типа элементу XML. Значение по умолчанию: Неявное." } } } } } }';
        assert.notEqual(updateCustomFunctions(123), true);
        assert.equal(updateCustomFunctions(strJSON), true);
      });

      it("проверка автокомплита для пользовательской функции МояФункция2", function () {
        bsl = helper('мояфу');
        let suggestions = [];
        bsl.getCommonCompletition(suggestions, bslGlobals.customFunctions, monaco.languages.CompletionItemKind.Function)
        expect(suggestions).to.be.an('array').that.not.is.empty;
      });

      it("проверка подсказки параметров для пользовательской функции МояФункция2", function () {
        bsl = helper('МояФункция2');        
        let suggestions = [];
        let help = bsl.getCommonSigHelp(bslGlobals.customFunctions);
        expect(help).to.have.property('activeParameter');
      });

      it("проверка автокомплита для функции 'Тип'", function () {
        bsl = helper('Тип("');
        assert.equal(bsl.requireType(), true);
        let suggestions = [];
        bsl.getTypesCompletition(suggestions, bslGlobals.types, monaco.languages.CompletionItemKind.Enum)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "СправочникСсылка"), true);        
      });

      it("проверка автокомплита для функции 'Тип' обернутой в функцию", function () {
        bsl = helper('Поиск = Найти(Тип("');
        assert.equal(bsl.requireType(), true);
        let suggestions = [];
        bsl.getTypesCompletition(suggestions, bslGlobals.types, monaco.languages.CompletionItemKind.Enum)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "СправочникСсылка"), true);        
      });

      it("проверка автокомплита для функции 'Тип' с указанием конкретного вида метаданных", function () {
        bsl = helper('Тип("СправочникСсылка.');
        assert.equal(bsl.requireType(), true);
        let suggestions = [];
        bsl.getTypesCompletition(suggestions, bslGlobals.types, monaco.languages.CompletionItemKind.Enum)
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "Товары"), true);        
      });

      it("проверка загрузки пользовательских объектов", function () {              	                        
        let strJSON = `{
          "customObjects":{
             "_СтруктураВыгрузки":{
                "properties":{
                   "Номенклатура":{
                      "name":"Номенклатура",
                      "description":"Ссылка на справочник номенклатуры",
                      "ref":"catalogs.Товары"
                   },
                   "Остаток":{
                      "name":"Остаток"
                   }
                }
             },
             "_ОстаткиТовара":{
                "properties":{
                   "Партия":{
                      "name":"Партия",
                      "description":"Ссылка на приходный документ",
                      "ref":"documents.ПриходнаяНакладная"
                   },
                   "Номенклатура":{
                      "name":"Номенклатура",
                      "ref":"catalogs.Товары"
                   },
                   "Оборот":{
                      "name":"Оборот"
                   }
                }
             }
          }
        }`;                
        let res = updateMetadata(strJSON);
        assert.equal(res, true);
        bsl = helper('_ОстаткиТ');
        let suggestions = [];
        bsl.getCustomObjectsCompletition(suggestions, bslMetadata.customObjects, monaco.languages.CompletionItemKind.Enum);
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "_ОстаткиТовара"), true);        
      });

      it("проверка подсказки ссылочных реквизитов", function () {              	                                
        bsl = helper('_ОстаткиТовара.Номенклатура.');
        let suggestions = [];
        contextData = new Map([
          [1, new Map([["Номенклатура", { "ref": "catalogs.Товары", "sig": null }]])]
        ]);
        bsl.getRefCompletition(suggestions);
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "СтавкаНДС"), true);        
        suggestions = [];
        bsl = helper('_ОстаткиТовара.Наминклатура.');
        bsl.getRefCompletition(suggestions);
        expect(suggestions).to.be.an('array').that.is.empty;
        contextData = new Map();
      });

      it("проверка подсказки для таблицы, полученной из результата запроса", function () {              	                                
        bsl = helper('ОбъектЗапрос = Новый Запрос();\nРезультат = ОбъектЗапрос.Выполнить();\nТаблица = Результат.Выгрузить();\nТаблица.');
        let suggestions = [];        
        contextData = new Map([
          [2, new Map([["Выполнить", { "ref": "types.РезультатЗапроса", "sig": null }]])],
          [3, new Map([["Выгрузить", { "ref": "classes.ТаблицаЗначений", "sig": null }]])]
        ]);        
        bsl.getRefCompletition(suggestions);
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "ВыгрузитьКолонку"), true);        
        contextData = new Map();
      });

      it("проверка подсказки параметров для функции ВыгрузитьКолонку таблицы значений, полученной из другой таблицы", function () {              	                                
        bsl = helper('Таблица1 = Новый ТаблицаЗначений();\nТаблица2 = Таблица1.Скопировать();\nТаблица2.ВыгрузитьКолонку(');
        let suggestions = [];  
        let signature = {
          "default": {
            "СтрокаПараметров": "(Колонка: Число): Массив",
            "Параметры": {
              "Колонка": "Колонка, из которой нужно выгрузить значения. В качестве значения параметра может быть передан индекс колонки, имя колонки, либо колонка дерева значений."
            }
          }
        };
        contextData = new Map([
          [2, new Map([["Скопировать", { "ref": "classes.ТаблицаЗначений", "sig": null }]])],
          [3, new Map([["ВыгрузитьКолонку", { "ref": "classes.Массив", "sig": signature }]])]
        ]);        
        let help = bsl.getRefSigHelp();        
        expect(help).to.have.property('activeParameter');
        contextData = new Map();
      });

      it("проверка подсказки для таблицы, полученной функцией НайтиПоСсылкам", function () {              	                                
        bsl = helper('Таблица = НайтиПоСсылкам();\nТаблица.');
        let suggestions = [];        
        contextData = new Map([
          [1, new Map([["НайтиПоСсылкам", { "ref": "classes.ТаблицаЗначений", "sig": null }]])]          
        ]);        
        bsl.getRefCompletition(suggestions);
        expect(suggestions).to.be.an('array').that.not.is.empty;
        assert.equal(suggestions.some(suggest => suggest.label === "ВыгрузитьКолонку"), true);        
        contextData = new Map();
      });

    }

    mocha.run();

  });

});