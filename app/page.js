"use client"
import dynamic from "next/dynamic"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"

export default function Home() {
  const { control, register, getValues } = useForm({
    defaultValues: {
      tasks: [
        {
          name: undefined,
          estimates: {
            optimistic: undefined,
            mostLikely: undefined,
            pessimistic: undefined,
          },
        },
      ],
    },
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "tasks",
  })

  const [results, setResults] = useState({
    totalEstimate: 0,
    standardDeviation: 0,
    riskPercentage: 0,
    riskClass: "bg-green-600"
  })

  const updateResults = () => {
    const tasks = getValues().tasks

    const totalEstimate = tasks.reduce((acc, task) => {
      const { optimistic, mostLikely, pessimistic } = task.estimates
      return acc + (Number(optimistic) + 4 * Number(mostLikely) + Number(pessimistic)) / 6
    }, 0)

    const standardDeviation = tasks.reduce((acc, task) => {
      const { optimistic, pessimistic } = task.estimates
      return acc + (Number(pessimistic) - Number(optimistic)) / 6
    }, 0)

    let estimationRisk = (standardDeviation / totalEstimate) * 100

    if(Number.isNaN(estimationRisk)) {
      estimationRisk = 0
    }

    const riskPercentage = estimationRisk * 3 > 100 ? 100 : estimationRisk * 3

    

    var riskClass = "bg-green-700";

    if (riskPercentage >= 40) {
      riskClass = "bg-yellow-700"
    }

    if (riskPercentage >= 60) {
      riskClass = "bg-amber-800"
    }

    if (riskPercentage >= 80) {
      riskClass = "bg-rose-800"
    }

    setResults({
      totalEstimate,
      standardDeviation,
      riskPercentage,
      riskClass
    })
  }

  const addTask = () => {
    append({
      name: undefined,
      estimates: {
        optimistic: undefined,
        mostLikely: undefined,
        pessimistic: undefined,
      },
    })
  }

  return (
    <main>
      <div className="wrapper">
        <h1>PERT Calculator</h1>
        <div className="content">
          <div className="results">
            <h2>Results</h2>
            <div className="card">
              <h3>Estimation</h3>
              <p className="display-number">{results.totalEstimate.toFixed(1)}</p>
            </div>
            <div className="card">
              <h3>Standard Deviation</h3>
              <p className="display-number">{(results.standardDeviation * 3).toFixed(1)}</p>
            </div>
            <div className="card">
              <h3>Delivery Risk</h3>
              <p className="display-number">{Math.round(results.riskPercentage)}</p>
              <div className="progress">
                <div className={`bar ${results.riskClass}`} style={{width: `${results.riskPercentage}%`}}></div>
              </div>
            </div>
          </div>
          <div className="tasks">
            <h2>Tasks</h2>
            <form onChange={updateResults}>
              {fields.map((field, index) => (
                <div key={field.id} className="task">
                  <input type="text" placeholder="Task Name"  {...register(`tasks.${index}.name`)} />
                  <div className="estimates">
                    <div className="input">
                      <label>Optimistic</label>
                      <input type="number" {...register(`tasks.${index}.estimates.optimistic`)}  />
                    </div>
                    <div className="input">
                      <label>Most Likely</label>
                      <input type="number" {...register(`tasks.${index}.estimates.mostLikely`)} />
                    </div>
                    <div className="input">
                      <label>Pessimistic</label>
                      <input type="number" {...register(`tasks.${index}.estimates.pessimistic`)} />
                    </div>
                  </div>
                </div>
              ))}
            </form>
            <button onClick={addTask}>Add Task</button>
          </div>
        </div>
      </div>
    </main>
  )
}
