# joker-generator

Шаблоны игровых ситуаций.

Для клиента:

1. Для валадации карт
```javascript
{
	"type": "validation",
	"hand": [{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "J",
		"suit": "H"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "A",
		"suit": "C"
	}],
	"cards_on_table": [{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "9",
		"suit": "H"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "Q",
		"suit": "D"
	}],
	"trump": "H",
	"answer": {
		"valid_cards": [{
			"colour": "0",
			"option": "0",
			"option_suit": "0",
			"rank": "J",
			"suit": "H"
		}]
	}
}
```
2. Для определения победителя:
```javascript
{
	"type": "won",
	"cards_on_table": [{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "9",
		"suit": "H"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "Q",
		"suit": "D"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "10",
		"suit": "H"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "6",
		"suit": "C"
	}],
	"trump":"H",
	"answer": {
		"won": 4
	}
}
```
