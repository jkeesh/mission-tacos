import argparse
import os


def _parse_arguments():
    parser = argparse.ArgumentParser(description='I heart tacos.')
    parser.add_argument("-d", "--daemonize", help="daemonize the server", action='store_true', default=False)
    parser.add_argument("--debug", help="debug mode (auto refreshes templates)", action='store_true', default=False)
    parser.add_argument("--port", default=8000, help="run on the given port", type=int)
    return parser.parse_args()
cli_args = _parse_arguments()

tornado_settings = dict(
    debug=cli_args.debug,  # always refresh templates
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
)
