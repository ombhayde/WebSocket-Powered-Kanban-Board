import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './TaskProgressChart.css';

const TaskProgressChart = ({ tasks }) => {
    // Calculate task counts for each column
    const todoCount = tasks.todo?.length || 0;
    const inProgressCount = tasks.inProgress?.length || 0;
    const doneCount = tasks.done?.length || 0;
    const totalTasks = todoCount + inProgressCount + doneCount;
    
    // Prepare data for the pie chart
    const chartData = [
        { name: 'To Do', value: todoCount, color: '#FF8042' },
        { name: 'In Progress', value: inProgressCount, color: '#FFBB28' },
        { name: 'Done', value: doneCount, color: '#00C49F' },
    ];

    // Calculate completion percentage
    const completionPercentage = totalTasks > 0 
        ? Math.round((doneCount / totalTasks) * 100) 
        : 0;

    return (
        <div className="chart-container" data-testid="task-progress-chart">
            <h2 className="chart-title">Task Progress</h2>
            
            <div className="chart-content">
                <div className="chart-stats">
                    <div className="stat-item">
                        <span className="stat-label">Total Tasks:</span>
                        <span className="stat-value">{totalTasks}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Completion:</span>
                        <span className="stat-value">{completionPercentage}%</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">To Do:</span>
                        <span className="stat-value todo-count">{todoCount}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">In Progress:</span>
                        <span className="stat-value in-progress-count">{inProgressCount}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Done:</span>
                        <span className="stat-value done-count">{doneCount}</span>
                    </div>
                </div>
                
                <div className="chart-visualization">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TaskProgressChart;