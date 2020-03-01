![image](https://user-images.githubusercontent.com/26948028/75599283-0d559580-5a69-11ea-999b-cb561260c942.png)

# react pie chart input
react version of my [piechartinput](https://github.com/andlehma/piechartinput) html element

# installation
for use in a react application, install from npm with

`npm install react-pie-chart-input`

to run the demo, clone the repo and run

`cd react-pie-chart-input/demo`

then `npm install` and `npm run build`

then open `index.html` in a browser.

# usage
```
<PieChartInput
    size={300}
    percents={[.5, .3, .2]}
    initialAngle={Math.PI}
    colors={['red', 'blue', '#00FF00']}
    lineThickness={5}
    handleRadius={10}
    callback={handleChange()}
/>
```

# live demo
[andrewlehman.me/react-pie-chart-input](http://andrewlehman.me/react-pie-chart-input)
