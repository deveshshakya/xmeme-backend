const handleUpload = (req, res, database) => {
    const {name, caption, url} = req.body;

    database('memes')
        .insert(
            {name: name, caption: caption, url: url}
        )
        .then(id => {
            return res.status(200).json({
                id: id[0]
            }).end();
        })
        .catch((err) => {
            return res.status(400).json(err).end();
        })
}

const handleGetMemes = (req, res, database) => {
    database
        .select('*')
        .from('memes')
        .orderBy('id', 'desc')
        .limit(100)
        .then(data => {
            return res.status(200).json(data).end();
        })
        .catch(() => {
            return res.status(404).end();
        })
}

const handleGetByID = (req, res, database) => {
    const {id} = req.params;

    database('memes')
        .where({id: id})
        .select('*')
        .then(data => {
            if (data.length > 0) {
                return res.status(200).json(data[0]).end();
            } else {
                throw 'Not found.';
            }
        })
        .catch(() => {
            return res.status(404).end();
        })
}

module.exports = {
    handleUpload: handleUpload,
    handleGetMemes: handleGetMemes,
    handleGetByID: handleGetByID
};
