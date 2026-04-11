import { useEffect, useState } from "react"
import API from "../api/axios"
import "./css/Wallet.css"
const WalletPage = () => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      const [walletRes, txnRes] = await Promise.all([
        API.get("/wallet/"),
        API.get("/wallet/transactions/")
      ])

      setBalance(walletRes.data.balance)
      setTransactions(txnRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="wallet-container">

  {/* Balance */}
  <div className="wallet-balance">
    <h2>Wallet Balance</h2>
    <h1>₹{balance}</h1>
  </div>

  {/* Transactions */}
  <div className="wallet-transactions">
    <h2>Transactions</h2>

    {transactions.length === 0 ? (
      <p className="no-transactions">No transactions yet</p>
    ) : (
      transactions.map((t) => (
        <div className="transaction-item" key={t.id}>
          <div className="transaction-info">
            <p>{t.description}</p>
            <span className="transaction-date">
              {new Date(t.created_at).toLocaleString()}
            </span>
          </div>

          <span
            className={`transaction-amount ${
              t.transaction_type === "credit" ? "credit" : "debit"
            }`}
          >
            {t.transaction_type === "credit" ? "+" : "-"}₹{t.amount}
          </span>
        </div>
      ))
    )}
  </div>

</div>
  )
}

export default WalletPage