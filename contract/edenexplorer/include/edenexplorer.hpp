#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>

namespace eden {
  struct edenexplorer_contract : public eosio::contract {
  public:
    using eosio::contract::contract;

    void categorize( eosio::name account, std::string & new_memo, std::string & tx_id );

    bool parse_memo(std::string & memo);

  private:
    const eosio::name DEFAULT_ACCOUNT = eosio::name( "edenexplorer" );
  };

  EOSIO_ACTIONS( edenexplorer_contract, "edenexplorer"_n, action( categorize, account, new_memo, tx_id ))

} // namespace eden
