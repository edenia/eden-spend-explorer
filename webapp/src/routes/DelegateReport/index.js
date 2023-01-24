import React, { memo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Spinner } from '@edenia/ui-kit'

import useDelegateReportState from '../../hooks/customHooks/useDelegateReportState'
import TreasuryBalance from '../../components/TreasuryBalance'
import SelectComponent from '../../components/Select'

import DelegateAccordion from './delegate-accordion'
import styles from './styles'

const useStyles = makeStyles(styles)

const DelegateReport = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { i18n } = useTranslation('translations')
  const options = { year: 'numeric', month: 'long', day: 'numeric' }

  const [
    {
      electionRoundSelect,
      electionRoundList,
      delegateList,
      dateElection,
      transactionList,
      categoryList,
      loader,
      accordionList,
      searchValue
    },
    { setElectionRoundSelect, setDelegateSelect, setSearchValue }
  ] = useDelegateReportState()

  const dateFormat = new Date(dateElection).toLocaleDateString(
    i18n.language,
    options
  )

  return (
    <div className={classes.root}>
      <div id="treasury-container-id">
        <TreasuryBalance />
      </div>
      <div className={classes.headPage}>
        <div className={classes.title}>
          <Typography variant="span">
            {`${t('electionTime', { ns: 'delegateRoute' })}: ${dateFormat}`}
          </Typography>
          <Typography variant="span">
            {t('instruction', { ns: 'delegateRoute' })}
          </Typography>
        </div>
        <div className={classes.filtersContainer}>
          <div id="combo-box-id">
            <Autocomplete
              options={delegateList.map(data => data.account || data.recipient)}
              onInputChange={(event, newInputValue) => {
                setSearchValue(newInputValue)
              }}
              autoHighlight
              clearOnEscape
              renderInput={params => (
                <TextField {...params} label="Delegate" variant="outlined" />
              )}
            />
          </div>
          <SelectComponent
            onChangeFunction={setElectionRoundSelect}
            labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
            values={electionRoundList.map(data => `${data.election}`)}
            actualValue={electionRoundSelect}
            width={100}
          />
        </div>
      </div>
      {loader ? (
        <div className={classes.spinner}>
          <Spinner />
        </div>
      ) : (
        <DelegateAccordion
          accordionList={accordionList}
          transactionList={transactionList}
          categoryList={categoryList}
          setDelegateSelect={setDelegateSelect}
          searchValue={searchValue}
          electionRoundSelect={electionRoundSelect}
        />
      )}
    </div>
  )
}

export default memo(DelegateReport)
