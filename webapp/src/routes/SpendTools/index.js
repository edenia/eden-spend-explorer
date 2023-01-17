import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import useSpendTools from '../../hooks/customHooks/useSpendToolsState'
import SnackbarComponent from '../../components/Snackbar'

import styles from './styles'
import SpendToolTableRerport from './spendTool-table-report'
import SpendToolFormReport from './spendTool-form-report'
import SpendToolModalReport from './spendTool-modal-report'

const useStyles = makeStyles(styles)

const SpendTools = () => {
  const classes = useStyles()
  const { t } = useTranslation('spendToolsRoute')
  const [
    {
      formValues,
      errors,
      errorsModal,
      openModal,
      formValuesModal,
      errorMessage,
      modalData,
      openSnackbar,
      loadingSignTransaction,
      transactionsList
    },
    {
      handleInputChange,
      handleInputChangeModal,
      handleCloseModal,
      handleOpenModal,
      setOpenSnackbar,
      handleRecategorizeTx,
      handleEosTransfer
    }
  ] = useSpendTools()

  return (
    <div className={classes.root}>
      <SpendToolModalReport
        handleInputChangeModal={handleInputChangeModal}
        loadingSignTransaction={loadingSignTransaction}
        handleRecategorizeTx={handleRecategorizeTx}
        handleCloseModal={handleCloseModal}
        formValuesModal={formValuesModal}
        errorMessage={errorMessage}
        errorsModal={errorsModal}
        modalData={modalData}
        openModal={openModal}
      />
      <SnackbarComponent
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        message={t('snackbarMessage')}
        buttonMessage={t('snackbarButton')}
      />
      <div>{t('viewAbout')}</div>
      <div className={classes.toolInformation}>{t('transferInformation')}</div>
      <SpendToolFormReport
        loadingSignTransaction={loadingSignTransaction}
        handleEosTransfer={handleEosTransfer}
        handleInputChange={handleInputChange}
        errorMessage={errorMessage}
        formValues={formValues}
        errors={errors}
      />
      <SpendToolTableRerport
        handleOpenModal={handleOpenModal}
        transactionsList={transactionsList}
      />
    </div>
  )
}

export default memo(SpendTools)
