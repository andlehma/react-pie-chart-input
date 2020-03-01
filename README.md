![image](https://user-images.githubusercontent.com/26948028/75599283-0d559580-5a69-11ea-999b-cb561260c942.png)

# react pie chart input
react version of my [piechartinput](https://github.com/andlehma/piechartinput) html element

# installation
`npm install react-pie-chart-input`

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