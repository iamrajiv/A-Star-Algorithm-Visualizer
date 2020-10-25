<div align="center">
<img src="assets/logo.svg" height=400" width="400" />
<br />
<h1>A* Algorithm Visualizer</h1>
<p align="center">
A simple pathfinding visualizer tool to visualize A* algorithm
</p>
<a href="https://github.com/iamrajiv/A-Star-Algorithm-Visualizer/network">
<img src="https://img.shields.io/github/forks/iamrajiv/A-Star-Algorithm-Visualizer?color=0366d6&style=for-the-badge"/>
</a>
<a href="https://github.com/iamrajiv/A-Star-Algorithm-Visualizer/stargazers">
<img src="https://img.shields.io/github/stars/iamrajiv/A-Star-Algorithm-Visualizer?color=0366d6&style=for-the-badge"/>
</a>
<a href="https://github.com/iamrajiv/A-Star-Algorithm-Visualizer/blob/master/LICENSE">
<img src="https://img.shields.io/github/license/iamrajiv/A-Star-Algorithm-Visualizer?color=0366d6&style=for-the-badge"/>
</a>
</div>

## About Project

A\* algorithm is a searching algorithm that searches for the shortest path between the initial and the final state. It is used in various applications, such as maps.

In maps, the A\* algorithm is used to calculate the shortest distance between the source (initial state) and the destination (final state)

A\* algorithm has 3 parameters:

- **g**: The cost of moving from the initial cell to the current cell. It is the sum of all the cells that have been visited since leaving the first cell.
- **h**: Also known as the heuristic value, it is the estimated cost of moving from the current cell to the final cell. The actual cost cannot be calculated until the final cell is reached. Hence, **h** is the estimated cost. We must make sure that there is never an overestimation of the cost.
- **f**: It is the sum of **g** and **h**.

So, **f = g + h**

The way that the algorithm makes its decisions is by taking the f-value into account. The algorithm selects the smallest f-valued cell and moves to that cell. This process continues until the algorithm reaches its goal cell.

## Installation & Setup

<a href="https://iamrajiv.github.io/A-Star-Algorithm-Visualizer/A-Star-Algorithm-Visualizer/index.html">Run Project</a>

## Example Usage

<p align="center"><img src="" height="300px" width="300px" /></p>

## License

[MIT](https://github.com/iamrajiv/A-Star-Algorithm-Visualizer/blob/master/LICENSE)
