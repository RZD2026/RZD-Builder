
# Compiler API

De Compiler API biedt een centrale toegang tot compilerobjecten.

## Doel

Alle compileronderdelen gebruiken dezelfde functies om objecten op te vragen.

Hierdoor:

- geen dubbele lookup-logica;
- consistente foutafhandeling;
- eenvoudige uitbreidbaarheid;
- optimale prestaties door gebruik van lookup-tabellen.

## Beschikbaar

### getTable(model, tableId)

Geeft een tabel terug.

### getList(model, listId)

Geeft een lijst terug.

### getField(table, fieldId)

Geeft een veld terug.

De lookup wordt automatisch opgebouwd bij het eerste gebruik.

### getRegistry(model, id)

Geeft een registry-item terug.

### findField(model, fieldId)

Zoekt een veld over alle tabellen.

Retourneert:

```js
{
    table,
    field
}
```

of

```js
undefined
```