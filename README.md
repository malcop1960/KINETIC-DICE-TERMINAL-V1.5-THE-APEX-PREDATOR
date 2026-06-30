# 🎯 KINETIC-DICE TERMINAL (V1.0 APEX)
**Deterministic Kinetic-Dice Matrix Protocol & Dynamic Yield Oracle**

![Version](https://img.shields.io/badge/Version-1.0.0-00E5FF.svg)
![Status](https://img.shields.io/badge/Status-Production_Ready-success.svg)
![Stack](https://img.shields.io/badge/Stack-React_%7C_TypeScript-blue.svg)

## 📖 Overview
The **Kinetic-Dice Terminal** is a stateless, deterministic analytics engine built to ruthlessly manage risk in live-dealer environments. 

Abandoning traditional fallacy and complex grid-chasing, this engine utilizes a proprietary **Kinetic-Dice Engine**. By evaluating the kinetic momentum (Spin A and Spin B), the system maps streams into a static **Target Matrix**.

Coupled with a self-aware, automated State Machine (The Dynamic Yield Oracle) and an autonomous **Tactical Circuit Breaker**, the application actively monitors wheel variance, dynamically deploying virtual "paper bets" during high volatility to protect capital, and instantly resuming active play during statistical rallies.

## 🧠 The Mathematical Core: Kinetic-Dice Engine
The engine's prediction matrix calculates physical board placement using a 6-rule kinetic math hierarchy:
1. **Target Calculation:** Bypasses immediate table noise by identifying a mathematical anchor.
2. **Double Street Mapping:** Maps calculations into standard 1-6 sectors based on hemisphere alignment.
3. **Target Matrix:** Evaluates subsequent spins against these fixed kinetic targets.
* **Risk/Reward:** Bet Cost: 2 Units flat. Win: +4 Units Net. Miss: -2 Units Net.

## 🛡️ Tactical Pause & Dynamic Yield Oracle
The terminal includes a dynamic, autonomous defense system to mitigate the house edge:
* **Tactical Circuit Breaker:** Automatically suspends active betting (switching to simulated paper-bets) if the rolling win-rate of the last evaluated spins falls below critical thresholds, freezing bankroll exposure.
* **Dynamic Yield Oracle:** A dynamic financial controller that scales down profit targets over time, calculates Matrix Efficiency to expand/contract trailing stops, and locks a strict breakeven floor whenever the session recovers from deep drawdowns.

## 📊 Quant Analytics & Pre-Flight Backtesting
* **Pre-Flight Qualifier:** A "cold-start" sandbox. Users input initial spins from a marquee before wagering. The app calculates theoretical ROI and Win Rate, grading the table before allowing the user to "Engage Live Play."
* **Real-Time Telemetry:** Features a dedicated analytics dashboard. Tracks Live Equity Curves, Maximum Drawdown, and renders a live Strike Zone Heatmap to identify localized signatures.

## ⚙️ Tech Stack
* **Frontend:** React.js, TypeScript, Tailwind CSS, Motion.
* **Data Visualization:** Recharts, D3.
* **Deployment:** PWA Native container.
