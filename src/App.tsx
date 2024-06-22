import styles from 'src/App.module.scss';
import GameTable from 'src/components/GameTable/GameTable';

function App() {
  return (
    <div className={styles.mainConainer}>
      <GameTable />
    </div>
  );
}

export default App;
