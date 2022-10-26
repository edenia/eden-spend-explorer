#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>

#include <edenexplorer.hpp>

namespace eden {

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

  void edenexplorer_contract::categorize( eosio::name  account,
                                          std::string &new_memo,
                                          std::string &tx_id ) {
    require_auth( account );

    eosio::action{ { get_self(), "active"_n },
                   "isedenmember"_n,
                   "checkmember"_n,
                   std::tuple{ account } }
        .send();

    eosio::check( parse_memo( new_memo ),
                  "Incorrect format or category, use: 'eden_expense: "
                  "<category>/<description>'" );
    eosio::check( tx_id.length() == 64, "Incorrect length transaction id" );
  }

  bool edenexplorer_contract::exist_category( std::string &category_name ) {
    int         pos_space = category_name.find( " " );
    std::string category =
        pos_space == -1
            ? category_name
            : category_name.substr( pos_space + 1, category_name.length() );

    return ( std::find( categories.begin(), categories.end(), category ) !=
             categories.end() );
  }

  bool edenexplorer_contract::parse_memo( std::string &memo ) {
    int         pos_backslash = memo.find( "/" );
    int         pos_colon = memo.find( ":" );
    std::string eden_expense = memo.substr( 0, pos_colon );

    if ( pos_colon == -1 || pos_backslash == -1 ||
         eden_expense != "eden_expense" )
      return false;

    std::string split_memo = memo.substr( 13, memo.length() );
    pos_backslash = split_memo.find( "/" );
    std::string category = split_memo.substr( 0, pos_backslash );

    return exist_category( category );
  }

} // namespace eden

EOSIO_ACTION_DISPATCHER( eden::actions )

EOSIO_ABIGEN( actions( eden::actions ) )
