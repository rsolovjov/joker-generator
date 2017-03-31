# joker-generator

Шаблоны игровых ситуаций.

Для клиента:

1. Для валадации карт
```javascript
{
	"type": "validation cards",
	"hand": [{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "J",
		"status": "1",
		"suit": "H"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "A",
		"status": "1",
		"suit": "C"
	}],
	"cards_on_table": [{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "9",
		"status": "7",
		"suit": "H"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "Q",
		"status": "8",
		"suit": "D"
	}],
	"trump": {
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "J",
		"status": "13",
		"suit": "H"
	},
	"answer": {
		"valid_cards": [{
			"colour": "0",
			"option": "0",
			"option_suit": "0",
			"rank": "J",
			"status": "1",
			"suit": "H"
		}]
	}
}
```
2. Для определения победителя:
```javascript
{
	"type": "determine the winner",
	"cards_on_table": [{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "9",
		"status": "7",
		"suit": "H"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "Q",
		"status": "8",
		"suit": "D"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "10",
		"status": "8",
		"suit": "H"
	},
	{
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "6",
		"status": "8",
		"suit": "C"
	}],
	"trump": {
		"colour": "0",
		"option": "0",
		"option_suit": "0",
		"rank": "J",
		"status": "13",
		"suit": "H"
	},
	"answer": {
		"won": 4
	}
}
```
