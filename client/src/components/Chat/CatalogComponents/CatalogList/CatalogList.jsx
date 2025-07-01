import { connect } from 'react-redux';
import Catalog from '../Catalog/Catalog';
import styles from '../CatalogListContainer/CatalogListContainer.module.sass';
import {
  changeShowModeCatalog,
  deleteCatalog,
} from '../../../../store/slices/chatSlice';

const CatalogList = (props) => {
  const { catalogList, changeShowModeCatalog, deleteCatalog } = props;
  const goToCatalog = (event, catalog) => {
    changeShowModeCatalog(catalog);
    event.stopPropagation();
  };

  const deleteCatalogFromList = (event, catalogId) => {
    deleteCatalog({ catalogId });
    event.stopPropagation();
  };

  const catalogElements = catalogList.map((catalog) => (
    <Catalog
      catalog={catalog}
      key={catalog.id}
      deleteCatalog={deleteCatalogFromList}
      goToCatalog={goToCatalog}
    />
  ));

  return (
    <div className={styles.listContainer}>
      {catalogElements.length ? (
        catalogElements
      ) : (
        <span className={styles.notFound}>Not found</span>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changeShowModeCatalog: (data) => dispatch(changeShowModeCatalog(data)),
  deleteCatalog: (data) => dispatch(deleteCatalog(data)),
});

export default connect(null, mapDispatchToProps)(CatalogList);
