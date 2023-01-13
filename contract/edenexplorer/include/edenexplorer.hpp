#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>

namespace eden {
  struct edenexplorer_contract : public eosio::contract {
  public:
    using eosio::contract::contract;

    const std::vector< std::string > categories = { "admin",
                                                    "charity",
                                                    "development",
                                                    "dues",
                                                    "education",
                                                    "hardware",
                                                    "infrastructure",
                                                    "legal",
                                                    "marketing",
                                                    "pomelo",
                                                    "salaries",
                                                    "software",
                                                    "travel",
                                                    "uncategorized" };

    void categorize( eosio::name  account,
                     std::string &new_memo,
                     std::string &tx_id,
                     std::string &digest );

    bool parse_memo( std::string &memo );

    bool exist_category( std::string &category );

  private:
    const eosio::name DEFAULT_ACCOUNT = eosio::name( "edenexplorer" );
  };

  EOSIO_ACTIONS( edenexplorer_contract,
                 "edenexplorer"_n,
                 action( categorize, account, new_memo, tx_id, digest ) )

} // namespace eden
