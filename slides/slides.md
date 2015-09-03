class: front-page

# Forutsigbar testing og tidsreiser

Mikael Brevik

04/09/2015

---
background-image: url(assets/space.jpg)
name: tardis
class: tardis-slide

<img src="assets/tardis.png" alt="Tardis" class="tardis-img" />

---
class: agenda

# Kort re-cap

 * Immutabel data
 * Rene komponenter

---
class: middle

```js
const myAppState = immutable({ name: 'John Smith' });
const newAppState = myAppState.set('name', 'The Doctor');

// Can access myAppState and newAppState
```

---
class: middle

```js
const NameCard = component(({name}) => hgroup({},
  h1({}, 'Hello! My name is:'),
  h2({}, name)
));
```

---
class: center middle

# Så.. Hva med det?
Demo


---
class: center middle

# Kommentar?
Twitter *@mikaelbrevik* eller snakk med meg i kveld!

Kode/Slides: https://github.com/mikaelbr/bekk-tardis

---
class: center middle

# Send gjerne tilbakemelding!
