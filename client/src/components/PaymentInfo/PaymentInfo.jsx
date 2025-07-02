import Error from '../Error/Error';
import styles from './PaymentInfo.module.sass';
import PayForm from '../PaymentForm/PaymentForm';

const PaymentInfo = (props) => {
  const { balance, cashOut, error, clearPaymentStore } = props;

  const pay = (values) => {
    const { number, expiry, cvc, sum } = values;
    cashOut({
      number,
      expiry,
      cvc,
      sum,
    });
  };

  return (
    <div className={styles.container}>
      {parseInt(balance) === 0 ? (
        <span className={styles.notMoney}>
          There is no money on your balance
        </span>
      ) : (
        <div>
          {error && (
            <Error
              data={error.data}
              status={error.status}
              clearError={clearPaymentStore}
            />
          )}
          <PayForm pay={pay} />
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;