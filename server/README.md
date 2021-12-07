# Local Setup

Clone the repository into a directory and run the following to install the dependancies:
```
npm install
```

Run the following command to start server:
```
npm run dev
```
#

# DOCUMENTATION

## Client to server

### 'joined'

```
{
    id  :   Integer,
    posx:   Integer, 
    posz:   Integer
}
```

### 'move'

```
{
    id  :   Integer,
    posx:   Integer, 
    posz:   Integer
}
```

### 'chatmessage'

```
{
    sender  :   String,
    message :   String
}
```



## Server to clients

### 'joined'

```
{
    id  :   Integer,
    posx:   Integer, 
    posz:   Integer
}
```


### 'players'

>Runs every second
```
[
    {
        id  :   Integer,
        posx:   Integer, 
        posz:   Integer
    }
]

```
### 'chatmessage'

>Runs every second
```
{
    [
        sender  :   String,
        message :   String
    ]
}
```